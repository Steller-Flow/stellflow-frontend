import { apiClient } from "./axiosClient";
import type { ApiResponse, PaginatedResponse } from "./types";
import type {
  Invoice,
  InvoiceFormData,
  InvoiceFilter,
  InvoiceSort,
  InvoicePagination,
  InvoiceStatus,
} from "../invoiceTypes";

export const invoiceService = {
  async getInvoices(params: {
    filter?: InvoiceFilter;
    sort?: InvoiceSort;
    pagination?: InvoicePagination;
  }): Promise<PaginatedResponse<Invoice>> {
    const { data } = await apiClient.get<PaginatedResponse<Invoice>>("/invoices", {
      params: {
        ...params.filter,
        sortField: params.sort?.field,
        sortDirection: params.sort?.direction,
        page: params.pagination?.page,
        pageSize: params.pagination?.pageSize,
      },
    });
    return data;
  },

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const { data } = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return data;
  },

  async createInvoice(invoiceData: InvoiceFormData): Promise<ApiResponse<Invoice>> {
    const { data } = await apiClient.post<ApiResponse<Invoice>>("/invoices", invoiceData);
    return data;
  },

  async updateInvoice(
    id: string,
    invoiceData: Partial<Invoice>
  ): Promise<ApiResponse<Invoice>> {
    const { data } = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${id}`, invoiceData);
    return data;
  },

  async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<ApiResponse<Invoice>> {
    const { data } = await apiClient.patch<ApiResponse<Invoice>>(`/invoices/${id}/status`, {
      status,
    });
    return data;
  },

  async sendInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const { data } = await apiClient.post<ApiResponse<Invoice>>(`/invoices/${id}/send`);
    return data;
  },

  async bulkDeleteInvoices(ids: string[]): Promise<void> {
    await apiClient.post("/invoices/bulk-delete", { ids });
  },

  async bulkUpdateStatus(ids: string[], status: InvoiceStatus): Promise<void> {
    await apiClient.post("/invoices/bulk-status", { ids, status });
  },
};
