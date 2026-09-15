/**
 * Read-only access to the StellFlow escrow contract over Soroban RPC.
 *
 * Every function here simulates a transaction and returns the result; nothing
 * is signed or submitted, and no wallet is needed. The signatures mirror
 * escrow/contracts/escrow/src/contract.rs in Steller-Flow/stellflow-smartcontract:
 *
 *   get_escrow(escrow_id: u64) -> Result<Escrow, EscrowError>
 *   get_admin() -> Option<Address>
 *   is_paused() -> bool
 *   get_version() -> u32
 *   get_escrow_ttl() -> u32
 *
 * The SDK is imported lazily so the landing page bundle does not pay for it
 * until a component actually asks the network.
 */

export type StellarNetwork = "testnet" | "public";

const NETWORK_PASSPHRASE: Record<StellarNetwork, string> = {
  testnet: "Test SDF Network ; September 2015",
  public: "Public Global Stellar Network ; September 2015",
};

const DEFAULT_RPC_URL: Record<StellarNetwork, string> = {
  testnet: "https://soroban-testnet.stellar.org",
  public: "https://mainnet.sorobanrpc.com",
};

function readNetwork(): StellarNetwork {
  const raw = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
  return raw === "public" ? "public" : "testnet";
}

export const STELLAR_NETWORK: StellarNetwork = readNetwork();
export const NETWORK_PASSPHRASE_ACTIVE = NETWORK_PASSPHRASE[STELLAR_NETWORK];
export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || DEFAULT_RPC_URL[STELLAR_NETWORK];
export const ESCROW_CONTRACT_ID =
  process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID ||
  "CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS";

export function explorerContractUrl(contractId = ESCROW_CONTRACT_ID): string {
  return `https://stellar.expert/explorer/${STELLAR_NETWORK}/contract/${contractId}`;
}

export function explorerAccountUrl(address: string): string {
  return `https://stellar.expert/explorer/${STELLAR_NETWORK}/account/${address}`;
}

/** Simulation needs a source account; it is never charged or checked. */
const SIMULATION_SOURCE = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

/** errors.rs — `#[contracterror] enum EscrowError`. */
export const ESCROW_ERROR_NAMES: Record<number, string> = {
  1: "InvalidAmount",
  2: "Unauthorized",
  3: "EscrowNotFound",
  4: "AlreadyFunded",
  5: "InvalidStatus",
  6: "AlreadyReleased",
  7: "AlreadyRefunded",
  8: "TransferFailed",
  9: "EscrowAlreadyExists",
};
export const ESCROW_NOT_FOUND = 3;

export type ContractCallErrorCode = "RPC_UNREACHABLE" | "CONTRACT_ERROR" | "SIMULATION_FAILED";

export class ContractCallError extends Error {
  code: ContractCallErrorCode;
  /** Set when the contract itself returned `Err(EscrowError)`. */
  contractErrorCode?: number;

  constructor(code: ContractCallErrorCode, message: string, contractErrorCode?: number) {
    super(message);
    this.name = "ContractCallError";
    this.code = code;
    this.contractErrorCode = contractErrorCode;
  }

  get contractErrorName(): string | undefined {
    return this.contractErrorCode === undefined
      ? undefined
      : (ESCROW_ERROR_NAMES[this.contractErrorCode] ?? `EscrowError(${this.contractErrorCode})`);
  }
}

/** types.rs — `EscrowStatus`. */
export type OnChainEscrowStatus =
  | "Pending"
  | "Funded"
  | "Released"
  | "Refunded"
  | "Cancelled"
  | "Disputed";

export type OnChainMilestone = {
  milestoneId: number;
  description: string;
  amount: bigint;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
  released: boolean;
};

export type OnChainEscrowEvent = {
  fromStatus: OnChainEscrowStatus;
  toStatus: OnChainEscrowStatus;
  actor: string;
  timestamp: bigint;
  amount: bigint;
};

/** types.rs — `Escrow`, with snake_case fields mapped to camelCase. */
export type OnChainEscrow = {
  escrowId: bigint;
  client: string;
  freelancer: string;
  token: string;
  amount: bigint;
  status: OnChainEscrowStatus;
  createdAt: bigint;
  fundedAt: bigint | null;
  releasedAt: bigint | null;
  refundedAt: bigint | null;
  cancelledAt: bigint | null;
  disputedAt: bigint | null;
  deadline: bigint | null;
  milestones: OnChainMilestone[];
  arbiter: string | null;
  feePercent: number;
  totalReleased: bigint;
  totalRefunded: bigint;
  history: OnChainEscrowEvent[];
};

export type ContractStatus = {
  contractId: string;
  network: StellarNetwork;
  rpcUrl: string;
  admin: string | null;
  paused: boolean;
  version: number;
  escrowTtl: number;
  latestLedger: number;
};

type SimulationResult = { value: unknown; latestLedger: number };

type StellarSdk = typeof import("@stellar/stellar-sdk");
let sdkPromise: Promise<StellarSdk> | undefined;

/** Load the SDK once, on first use, and share it across concurrent calls. */
function loadSdk(): Promise<StellarSdk> {
  sdkPromise ??= import("@stellar/stellar-sdk");
  return sdkPromise;
}

/**
 * Build a transaction that calls `fn` on the escrow contract and simulate it.
 * Returns the decoded return value. Maps the three failure modes to
 * ContractCallError: RPC unreachable, contract returned Err(n), anything else.
 */
async function simulateCall(
  fn: string,
  args: import("@stellar/stellar-sdk").xdr.ScVal[] = []
): Promise<SimulationResult> {
  const sdk = await loadSdk();
  const server = new sdk.rpc.Server(SOROBAN_RPC_URL);
  const contract = new sdk.Contract(ESCROW_CONTRACT_ID);
  const source = new sdk.Account(SIMULATION_SOURCE, "0");

  const tx = new sdk.TransactionBuilder(source, {
    fee: sdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE_ACTIVE,
  })
    .addOperation(contract.call(fn, ...args))
    .setTimeout(30)
    .build();

  let sim: Awaited<ReturnType<typeof server.simulateTransaction>>;
  try {
    sim = await server.simulateTransaction(tx);
  } catch (error) {
    throw new ContractCallError(
      "RPC_UNREACHABLE",
      `Could not reach Soroban RPC at ${SOROBAN_RPC_URL}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (sdk.rpc.Api.isSimulationError(sim)) {
    // A contract `Err(EscrowError::X)` surfaces as "HostError: Error(Contract, #n)".
    const contractError = /Error\(Contract, #(\d+)\)/.exec(sim.error);
    if (contractError) {
      const code = Number(contractError[1]);
      throw new ContractCallError(
        "CONTRACT_ERROR",
        `${fn} returned ${ESCROW_ERROR_NAMES[code] ?? "EscrowError"} (#${code})`,
        code
      );
    }
    throw new ContractCallError("SIMULATION_FAILED", `${fn} simulation failed: ${sim.error}`);
  }

  if (!sim.result) {
    throw new ContractCallError("SIMULATION_FAILED", `${fn} simulation returned no result`);
  }

  return { value: sdk.scValToNative(sim.result.retval), latestLedger: sim.latestLedger };
}

/** `#[contracttype] enum` unit variants decode as `["Variant"]`. */
function unitVariant<T extends string>(value: unknown): T {
  return (Array.isArray(value) ? value[0] : value) as T;
}

function optional<T>(value: unknown): T | null {
  return value === undefined || value === null ? null : (value as T);
}

type NativeRecord = Record<string, unknown>;

export function decodeEscrow(raw: unknown): OnChainEscrow {
  const r = raw as NativeRecord;
  return {
    escrowId: BigInt(r.escrow_id as bigint),
    client: String(r.client),
    freelancer: String(r.freelancer),
    token: String(r.token),
    amount: BigInt(r.amount as bigint),
    status: unitVariant<OnChainEscrowStatus>(r.status),
    createdAt: BigInt(r.created_at as bigint),
    fundedAt: optional<bigint>(r.funded_at),
    releasedAt: optional<bigint>(r.released_at),
    refundedAt: optional<bigint>(r.refunded_at),
    cancelledAt: optional<bigint>(r.cancelled_at),
    disputedAt: optional<bigint>(r.disputed_at),
    deadline: optional<bigint>(r.deadline),
    milestones: ((r.milestones as NativeRecord[]) ?? []).map((m) => ({
      milestoneId: Number(m.milestone_id),
      description: String(m.description),
      amount: BigInt(m.amount as bigint),
      status: unitVariant(m.status),
      released: Boolean(m.released),
    })),
    arbiter: optional<string>(r.arbiter),
    feePercent: Number(r.fee_percent),
    totalReleased: BigInt(r.total_released as bigint),
    totalRefunded: BigInt(r.total_refunded as bigint),
    history: ((r.history as NativeRecord[]) ?? []).map((e) => ({
      fromStatus: unitVariant<OnChainEscrowStatus>(e.from_status),
      toStatus: unitVariant<OnChainEscrowStatus>(e.to_status),
      actor: String(e.actor),
      timestamp: BigInt(e.timestamp as bigint),
      amount: BigInt(e.amount as bigint),
    })),
  };
}

/** get_admin, is_paused, get_version, get_escrow_ttl — four simulations. */
export async function getContractStatus(): Promise<ContractStatus> {
  const [admin, paused, version, ttl] = await Promise.all([
    simulateCall("get_admin"),
    simulateCall("is_paused"),
    simulateCall("get_version"),
    simulateCall("get_escrow_ttl"),
  ]);
  return {
    contractId: ESCROW_CONTRACT_ID,
    network: STELLAR_NETWORK,
    rpcUrl: SOROBAN_RPC_URL,
    admin: optional<string>(admin.value),
    paused: Boolean(paused.value),
    version: Number(version.value),
    escrowTtl: Number(ttl.value),
    latestLedger: Math.max(admin.latestLedger, paused.latestLedger, version.latestLedger, ttl.latestLedger),
  };
}

/**
 * get_escrow(escrow_id: u64). Throws ContractCallError with
 * contractErrorCode === ESCROW_NOT_FOUND (3) when the id does not exist.
 */
export async function getEscrow(escrowId: bigint): Promise<{ escrow: OnChainEscrow; latestLedger: number }> {
  if (escrowId < BigInt(0) || escrowId > BigInt("0xffffffffffffffff")) {
    throw new RangeError("escrow_id must fit in a u64");
  }
  const sdk = await loadSdk();
  const { value, latestLedger } = await simulateCall("get_escrow", [
    sdk.nativeToScVal(escrowId, { type: "u64" }),
  ]);
  return { escrow: decodeEscrow(value), latestLedger };
}
