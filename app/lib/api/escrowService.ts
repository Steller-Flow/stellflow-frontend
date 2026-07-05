import { apiClient } from "./axiosClient";
import type { ApiResponse, PaginatedResponse } from "./types";
import type {
  Escrow,
  EscrowStatus,
  MilestoneStatus,
} from "../types";

export type CreateEscrowData = {
  title: string;
  description: string;
  clientAddress: string;
  freelancerAddress: string;
  totalAmount: number;
  currency: "USDC" | "XLM";
  deadline?: string;
  milestones: Array<{
    title: string;
    description: string;
    amount: number;
    dueDate?: string;
  }>;
};

export const escrowService = {
  async getEscrows(params?: {
    page?: number;
    pageSize?: number;
    status?: EscrowStatus[];
  }): Promise<PaginatedResponse<Escrow>> {
    const { data } = await apiClient.get<PaginatedResponse<Escrow>>("/escrows", {
      params,
    });
    return data;
  },

  async getEscrow(id: string): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.get<ApiResponse<Escrow>>(`/escrows/${id}`);
    return data;
  },

  async createEscrow(escrowData: CreateEscrowData): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.post<ApiResponse<Escrow>>("/escrows", escrowData);
    return data;
  },

  async updateEscrowStatus(id: string, status: EscrowStatus): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.patch<ApiResponse<Escrow>>(`/escrows/${id}/status`, {
      status,
    });
    return data;
  },

  async updateMilestoneStatus(
    escrowId: string,
    milestoneId: string,
    status: MilestoneStatus
  ): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.patch<ApiResponse<Escrow>>(
      `/escrows/${escrowId}/milestones/${milestoneId}`,
      { status }
    );
    return data;
  },

  async fundEscrow(id: string): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.post<ApiResponse<Escrow>>(`/escrows/${id}/fund`);
    return data;
  },

  async releaseEscrow(id: string): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.post<ApiResponse<Escrow>>(`/escrows/${id}/release`);
    return data;
  },

  async refundEscrow(id: string): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.post<ApiResponse<Escrow>>(`/escrows/${id}/refund`);
    return data;
  },

  async openDispute(escrowId: string, reason: string): Promise<ApiResponse<Escrow>> {
    const { data } = await apiClient.post<ApiResponse<Escrow>>(`/escrows/${escrowId}/dispute`, {
      reason,
    });
    return data;
  },
};
