"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "../types";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
};

type NotificationActions = {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  getUnreadCount: () => number;
  getRecentNotifications: (limit?: number) => Notification[];
};

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isOpen: false,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),

      addNotification: (notification) =>
        set((state) => {
          const notifications = [notification, ...state.notifications];
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      markAsRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      deleteNotification: (id) =>
        set((state) => {
          const notifications = state.notifications.filter((n) => n.id !== id);
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),

      getUnreadCount: () => get().unreadCount,
      getRecentNotifications: (limit = 10) => get().notifications.slice(0, limit),
    }),
    {
      name: "stellflow-notifications",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
