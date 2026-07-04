"use client";

import {
  Bell,
  Check,
  CheckCheck,
  CreditCard,
  FileText,
  Info,
  LockKeyhole,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { DashboardShell } from "../../components/DashboardShell";
import { useNotificationStore } from "../../lib/stores/notificationStore";
import type { Notification, NotificationType } from "../../lib/types";

const NOTIFICATION_ICONS: Record<NotificationType, React.ComponentType<{ size?: number; className?: string }>> = {
  INVOICE_RECEIVED: FileText,
  INVOICE_PAID: CreditCard,
  ESCROW_FUNDED: LockKeyhole,
  ESCROW_MILESTONE_APPROVED: Check,
  ESCROW_RELEASED: LockKeyhole,
  ESCROW_DISPUTED: ShieldAlert,
  SYSTEM_UPDATE: Info,
  SECURITY_ALERT: ShieldAlert,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  INVOICE_RECEIVED: "bg-status-info/10 text-status-info",
  INVOICE_PAID: "bg-status-success/10 text-status-success",
  ESCROW_FUNDED: "bg-primary-tint text-primary",
  ESCROW_MILESTONE_APPROVED: "bg-status-success/10 text-status-success",
  ESCROW_RELEASED: "bg-status-success/10 text-status-success",
  ESCROW_DISPUTED: "bg-status-error/10 text-status-error",
  SYSTEM_UPDATE: "bg-secondary-container text-secondary",
  SECURITY_ALERT: "bg-status-error/10 text-status-error",
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <DashboardShell
      activeHref="/dashboard/notifications"
      title="Notifications"
      description="Stay ahead of approvals, settlement events, and wallet activity."
    >
      <div className="space-y-lg">
        {notifications.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-sm">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex h-9 items-center justify-center gap-sm rounded-lg border border-border bg-white px-md text-sm font-semibold text-text-primary transition hover:bg-surface-container-low"
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-9 items-center justify-center gap-sm rounded-lg border border-border bg-white px-md text-sm font-semibold text-text-secondary transition hover:bg-surface-container-low hover:text-status-error"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            </div>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-divider bg-card-bg p-xl shadow-sm">
            <div className="mx-auto flex max-w-[520px] flex-col items-center py-2xl text-center">
              <div className="relative mb-lg">
                <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Bell size={36} />
                </div>
              </div>
              <h2 className="font-display mb-sm text-2xl font-semibold text-text-primary">
                No notifications yet
              </h2>
              <p className="mb-xl text-text-secondary">
                Funding alerts, payout approvals, dispute updates, and workspace
                messages will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-divider bg-card-bg shadow-sm">
            <div className="divide-y divide-divider">
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

type NotificationListItemProps = {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  formatTime: (dateString: string) => string;
};

function NotificationListItem({
  notification,
  onRead,
  onDelete,
  formatTime,
}: NotificationListItemProps) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const colorClass = NOTIFICATION_COLORS[notification.type];

  return (
    <div
      className={`flex gap-lg px-lg py-lg transition hover:bg-surface-container-low ${
        !notification.read ? "bg-primary-tint/30" : ""
      }`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-md">
          <div>
            <p
              className={`${
                !notification.read ? "font-semibold text-text-primary" : "text-text-secondary"
              }`}
            >
              {notification.title}
            </p>
            <p className="mt-xs text-sm text-text-secondary">
              {notification.message}
            </p>
          </div>
          {!notification.read && (
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <div className="mt-md flex items-center gap-md">
          <span className="text-xs text-text-muted">
            {formatTime(notification.createdAt)}
          </span>
          <div className="flex items-center gap-sm">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onRead(notification.id)}
                className="inline-flex items-center gap-xs rounded-md px-sm py-xs text-xs font-medium text-primary transition hover:bg-primary-tint"
              >
                <Check size={12} />
                Mark read
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="inline-flex items-center gap-xs rounded-md px-sm py-xs text-xs font-medium text-text-muted transition hover:bg-error-container hover:text-status-error"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
