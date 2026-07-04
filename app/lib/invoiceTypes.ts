export type InvoiceStatus = "DRAFT" | "SENT" | "VIEWED" | "PAID" | "OVERDUE" | "CANCELLED";

export type Currency = "USDC" | "XLM" | "USD";

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
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceFormData = {
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  lineItems: Omit<InvoiceLineItem, "id" | "amount">[];
  taxRate: number;
  notes?: string;
};

export type InvoiceFilter = {
  status?: InvoiceStatus[];
  dateRange?: { start: string; end: string };
  amountRange?: { min: number; max: number };
  client?: string;
  search?: string;
};

export type InvoiceSort = {
  field: "invoiceNumber" | "clientName" | "total" | "dueDate" | "status" | "createdAt";
  direction: "asc" | "desc";
};

export type InvoicePagination = {
  page: number;
  pageSize: number;
  total: number;
};

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: "bg-surface-container text-text-secondary",
  SENT: "bg-status-info/10 text-status-info",
  VIEWED: "bg-secondary-container text-secondary",
  PAID: "bg-status-success/10 text-status-success",
  OVERDUE: "bg-status-error/10 text-status-error",
  CANCELLED: "bg-surface-container text-text-muted",
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USDC: "$",
  XLM: "☆",
  USD: "$",
};
