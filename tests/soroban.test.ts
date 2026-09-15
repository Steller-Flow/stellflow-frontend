// @vitest-environment node
/**
 * app/lib/soroban.ts against a mocked Soroban RPC. The real SDK is used for
 * XDR encoding/decoding (so the u64 argument and the Escrow struct decode
 * are exercised for real); only rpc.Server#simulateTransaction is replaced.
 * Node environment: the SDK's XDR encoder rejects jsdom's cross-realm
 * Uint8Array.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as realSdk from "@stellar/stellar-sdk";

const simulateTransaction = vi.hoisted(() => vi.fn());

vi.mock("@stellar/stellar-sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@stellar/stellar-sdk")>();
  class Server {
    constructor(public url: string) {}
    simulateTransaction = simulateTransaction;
  }
  return { ...actual, rpc: { ...actual.rpc, Server } };
});

const { getContractStatus, getEscrow, decodeEscrow, ContractCallError, ESCROW_NOT_FOUND } =
  await import("../app/lib/soroban");

const { xdr, nativeToScVal, Address } = realSdk;
const ADMIN = "GA4V7OOAN2EIPSBDTKMKSD3BQ36FTZQ3XH6GSLIIAMX6TRM3NEDM5MIU";
const CLIENT = realSdk.Keypair.fromRawEd25519Seed(Buffer.alloc(32, 7)).publicKey();

/** A successful simulation whose return value is `retval`. */
const ok = (retval: realSdk.xdr.ScVal, latestLedger = 4695652) => ({
  latestLedger,
  result: { retval, auth: [] },
  transactionData: undefined,
  minResourceFee: "0",
  events: [],
});

/** What the SDK returns when the contract traps with `Err(EscrowError::n)`. */
const contractErr = (n: number) => ({
  latestLedger: 4695652,
  error: `HostError: Error(Contract, #${n})\n\nEvent log (newest first):\n   0: [Diagnostic Event] ...`,
  events: [],
});

const sym = (s: string) => xdr.ScVal.scvSymbol(s);
const entry = (key: string, val: realSdk.xdr.ScVal) => new xdr.ScMapEntry({ key: sym(key), val });
const unit = (variant: string) => xdr.ScVal.scvVec([sym(variant)]);
const addr = (a: string) => new Address(a).toScVal();
const u64 = (n: number | bigint) => nativeToScVal(BigInt(n), { type: "u64" });
const i128 = (n: number | bigint) => nativeToScVal(BigInt(n), { type: "i128" });
const u32 = (n: number) => nativeToScVal(n, { type: "u32" });
const none = () => xdr.ScVal.scvVoid();

/** An `Escrow` struct as types.rs lays it out (map keys sorted, as Soroban requires). */
function escrowScVal() {
  const milestone = xdr.ScVal.scvMap([
    entry("amount", i128(500_0000000)),
    entry("description", xdr.ScVal.scvString("Design")),
    entry("milestone_id", u32(1)),
    entry("released", xdr.ScVal.scvBool(false)),
    entry("status", unit("Pending")),
  ]);
  const event = xdr.ScVal.scvMap([
    entry("actor", addr(CLIENT)),
    entry("amount", i128(1000_0000000)),
    entry("from_status", unit("Pending")),
    entry("timestamp", u64(1789500000)),
    entry("to_status", unit("Funded")),
  ]);
  return xdr.ScVal.scvMap([
    entry("amount", i128(1000_0000000)),
    entry("arbiter", none()),
    entry("cancelled_at", none()),
    entry("client", addr(CLIENT)),
    entry("created_at", u64(1789499000)),
    entry("deadline", none()),
    entry("disputed_at", none()),
    entry("escrow_id", u64(7)),
    entry("fee_percent", u32(2)),
    entry("freelancer", addr(ADMIN)),
    entry("funded_at", u64(1789500000)),
    entry("history", xdr.ScVal.scvVec([event])),
    entry("milestones", xdr.ScVal.scvVec([milestone])),
    entry("refunded_at", none()),
    entry("released_at", none()),
    entry("status", unit("Funded")),
    entry("token", addr("CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS")),
    entry("total_refunded", i128(0)),
    entry("total_released", i128(0)),
  ]);
}

/**
 * The invoke_contract payload of the n-th simulated transaction, via the
 * operation's JSON form ({ invoke_contract: { function_name, args } }).
 */
function invokeArgs(callIndex: number): { function_name: string; args: Array<Record<string, string>> } {
  const [tx] = simulateTransaction.mock.calls[callIndex];
  const op = JSON.parse(JSON.stringify((tx as realSdk.Transaction).operations[0]));
  return op.func.invoke_contract;
}

/** The contract function name the mocked server was asked to simulate, in order. */
function calledFunctions(): string[] {
  return simulateTransaction.mock.calls.map((_, i) => invokeArgs(i).function_name);
}

// mockClear, not mockReset: after mockReset, vitest 4 reports a rejection
// coming out of the spy's implementation as a test failure even when the
// code under test catches it. Implementations are set per test below.
beforeEach(() => {
  simulateTransaction.mockClear();
  simulateTransaction.mockImplementation(() => {
    throw new Error("test did not queue a simulation result");
  });
});

describe("getContractStatus", () => {
  it("simulates the four getters and decodes their return values", async () => {
    simulateTransaction
      .mockResolvedValueOnce(ok(addr(ADMIN), 100)) // get_admin -> Some(addr) encodes as the bare address
      .mockResolvedValueOnce(ok(xdr.ScVal.scvBool(false), 101)) // is_paused
      .mockResolvedValueOnce(ok(u32(1), 102)) // get_version
      .mockResolvedValueOnce(ok(u32(2_000_000), 103)); // get_escrow_ttl

    const status = await getContractStatus();

    expect(calledFunctions()).toEqual(["get_admin", "is_paused", "get_version", "get_escrow_ttl"]);
    expect(status).toMatchObject({
      contractId: "CA77HTQMZAFBU5GVVFOEHT6AGCOVZJ2MXSEZ33DJJSZWY6NFFPPI67RS",
      network: "testnet",
      rpcUrl: "https://soroban-testnet.stellar.org",
      admin: ADMIN,
      paused: false,
      version: 1,
      escrowTtl: 2_000_000,
      latestLedger: 103,
    });
  });

  it("reports RPC_UNREACHABLE when the RPC request itself fails", async () => {
    // What the SDK throws when the RPC host is unreachable.
    simulateTransaction.mockImplementation(() => Promise.reject(new TypeError("fetch failed")));

    const error = (await getContractStatus().catch((e: unknown) => e)) as InstanceType<typeof ContractCallError>;
    expect(error).toBeInstanceOf(ContractCallError);
    expect(error.code).toBe("RPC_UNREACHABLE");
    expect(error.message).toContain("https://soroban-testnet.stellar.org");
  });
});

describe("getEscrow", () => {
  it("encodes the id as u64 and decodes the Escrow struct", async () => {
    simulateTransaction.mockResolvedValueOnce(ok(escrowScVal(), 4695700));

    const { escrow, latestLedger } = await getEscrow(BigInt(7));

    expect(calledFunctions()).toEqual(["get_escrow"]);
    expect(invokeArgs(0).args).toEqual([{ u64: "7" }]);

    expect(latestLedger).toBe(4695700);
    expect(escrow).toMatchObject({
      escrowId: BigInt(7),
      client: CLIENT,
      freelancer: ADMIN,
      amount: BigInt(1000_0000000),
      status: "Funded",
      fundedAt: BigInt(1789500000),
      releasedAt: null,
      deadline: null,
      arbiter: null,
      feePercent: 2,
      totalReleased: BigInt(0),
    });
    expect(escrow.milestones).toEqual([
      { milestoneId: 1, description: "Design", amount: BigInt(500_0000000), status: "Pending", released: false },
    ]);
    expect(escrow.history).toEqual([
      { fromStatus: "Pending", toStatus: "Funded", actor: CLIENT, timestamp: BigInt(1789500000), amount: BigInt(1000_0000000) },
    ]);
  });

  it("maps Error(Contract, #3) to CONTRACT_ERROR / EscrowNotFound", async () => {
    simulateTransaction.mockResolvedValueOnce(contractErr(3));

    const error = await getEscrow(BigInt(1)).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ContractCallError);
    expect(error).toMatchObject({
      code: "CONTRACT_ERROR",
      contractErrorCode: ESCROW_NOT_FOUND,
      contractErrorName: "EscrowNotFound",
      message: "get_escrow returned EscrowNotFound (#3)",
    });
  });

  it("maps other contract errors by their errors.rs name", async () => {
    simulateTransaction.mockResolvedValueOnce(contractErr(2));
    await expect(getEscrow(BigInt(1))).rejects.toMatchObject({ contractErrorCode: 2, contractErrorName: "Unauthorized" });
  });

  it("reports SIMULATION_FAILED for a non-contract simulation error", async () => {
    simulateTransaction.mockResolvedValueOnce({ latestLedger: 1, error: "HostError: Error(Budget, ExceededLimit)", events: [] });
    await expect(getEscrow(BigInt(1))).rejects.toMatchObject({ code: "SIMULATION_FAILED" });
  });

  it("rejects ids outside u64 before touching the network", async () => {
    await expect(getEscrow(BigInt(-1))).rejects.toBeInstanceOf(RangeError);
    await expect(getEscrow(BigInt("18446744073709551616"))).rejects.toBeInstanceOf(RangeError);
    expect(simulateTransaction).not.toHaveBeenCalled();
  });
});

describe("decodeEscrow", () => {
  it("handles unit-variant enums given as bare strings or one-element arrays", () => {
    const base = { escrow_id: BigInt(1), client: CLIENT, freelancer: ADMIN, token: "C", amount: BigInt(1), created_at: BigInt(1), fee_percent: 0, total_released: BigInt(0), total_refunded: BigInt(0) };
    expect(decodeEscrow({ ...base, status: ["Released"] }).status).toBe("Released");
    expect(decodeEscrow({ ...base, status: "Disputed" }).status).toBe("Disputed");
    expect(decodeEscrow({ ...base, status: "Pending" }).milestones).toEqual([]);
  });
});
