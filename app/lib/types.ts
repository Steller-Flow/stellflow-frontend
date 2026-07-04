export type WalletSession = {
  connected: boolean;
  onboarded: boolean;
  address: string | null;
};

export type InvoiceStatus = "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED";

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  currency: "USDC" | "XLM" | "USD";
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type EscrowStatus =
  | "CREATED"
  | "PENDING"
  | "FUNDED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "RELEASED"
  | "DISPUTED"
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

export type EscrowTransaction = {
  id: string;
  type: string;
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
  status: EscrowStatus;
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

export type NotificationType =
  | "INVOICE_RECEIVED"
  | "INVOICE_PAID"
  | "ESCROW_FUNDED"
  | "ESCROW_MILESTONE_APPROVED"
  | "ESCROW_RELEASED"
  | "ESCROW_DISPUTED"
  | "SYSTEM_UPDATE"
  | "SECURITY_ALERT";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, unknown>;
};

export type UISidebarState = {
  collapsed: boolean;
  mobileOpen: boolean;
};

export type UIModalState = {
  createInvoice: boolean;
  createEscrow: boolean;
  walletConnect: boolean;
  notificationCenter: boolean;
};
