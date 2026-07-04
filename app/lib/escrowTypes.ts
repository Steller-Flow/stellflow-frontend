export type EscrowState =
  | "CREATED"
  | "FUNDED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "RELEASED"
  | "DISPUTED"
  | "REFUNDED"
  | "CANCELLED";

export type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type EscrowMilestone = {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate?: string;
  completedAt?: string;
};

export type EscrowParty = {
  address: string;
  name?: string;
  role: "CLIENT" | "FREELANCER" | "ARBITER";
};

export type TransactionType =
  | "CREATED"
  | "FUNDED"
  | "MILESTONE_SUBMITTED"
  | "MILESTONE_APPROVED"
  | "MILESTONE_REJECTED"
  | "PARTIAL_RELEASE"
  | "FULL_RELEASE"
  | "DISPUTE_OPENED"
  | "DISPUTE_RESOLVED"
  | "REFUND"
  | "CANCELLED";

export type EscrowTransaction = {
  id: string;
  type: TransactionType;
  amount?: number;
  from?: string;
  to?: string;
  timestamp: string;
  txHash?: string;
  note?: string;
};

export type Escrow = {
  id: string;
  title: string;
  description: string;
  state: EscrowState;
  client: EscrowParty;
  freelancer: EscrowParty;
  totalAmount: number;
  releasedAmount: number;
  currency: "USDC" | "XLM";
  milestones: EscrowMilestone[];
  transactions: EscrowTransaction[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
};

export const ESCROW_STATE_LABELS: Record<EscrowState, string> = {
  CREATED: "Created",
  FUNDED: "Funded",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  RELEASED: "Released",
  DISPUTED: "Disputed",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export const ESCROW_STATE_COLORS: Record<EscrowState, string> = {
  CREATED: "bg-surface-container text-text-secondary",
  FUNDED: "bg-status-info/10 text-status-info",
  IN_PROGRESS: "bg-primary-tint text-primary",
  SUBMITTED: "bg-secondary-container text-secondary",
  UNDER_REVIEW: "bg-status-warning/10 text-status-warning",
  APPROVED: "bg-status-success/10 text-status-success",
  RELEASED: "bg-status-success text-on-primary",
  DISPUTED: "bg-status-error/10 text-status-error",
  REFUNDED: "bg-status-error/10 text-status-error",
  CANCELLED: "bg-surface-container text-text-muted",
};

export const ESCROW_STATE_FLOW: EscrowState[] = [
  "CREATED",
  "FUNDED",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "RELEASED",
];

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const MILESTONE_STATUS_COLORS: Record<MilestoneStatus, string> = {
  PENDING: "bg-surface-container text-text-muted",
  IN_PROGRESS: "bg-status-info/10 text-status-info",
  SUBMITTED: "bg-secondary-container text-secondary",
  APPROVED: "bg-status-success/10 text-status-success",
  REJECTED: "bg-status-error/10 text-status-error",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  CREATED: "Escrow Created",
  FUNDED: "Funds Deposited",
  MILESTONE_SUBMITTED: "Milestone Submitted",
  MILESTONE_APPROVED: "Milestone Approved",
  MILESTONE_REJECTED: "Milestone Rejected",
  PARTIAL_RELEASE: "Partial Release",
  FULL_RELEASE: "Full Release",
  DISPUTE_OPENED: "Dispute Opened",
  DISPUTE_RESOLVED: "Dispute Resolved",
  REFUND: "Refund Issued",
  CANCELLED: "Escrow Cancelled",
};
