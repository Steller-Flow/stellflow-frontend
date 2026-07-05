import { apiClient } from "./axiosClient";
import type { ApiResponse, PaginatedResponse } from "./types";
import type { Notification } from "../types";

export const notificationService = {
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>("/notifications", {
      params,
    });
    return data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post("/notifications/read-all");
  },

  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },

  async clearAll(): Promise<void> {
    await apiClient.delete("/notifications");
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count"
    );
    return data;
  },
};
