"use client";

import { useEffect, useRef } from "react";
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
  X,
} from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "../lib/stores/notificationStore";
import type { Notification, NotificationType } from "../lib/types";

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

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isOpen,
    toggleOpen,
    setOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getRecentNotifications,
  } = useNotificationStore();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpen]);

  const recentNotifications = getRecentNotifications(8);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="relative rounded-full p-md text-text-secondary transition hover:bg-surface-container-low hover:text-primary"
        aria-label="Open notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-status-error text-[10px] font-bold text-on-primary">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-sm w-[380px] overflow-hidden rounded-xl border border-divider bg-card-bg shadow-xl">
          <header className="flex items-center justify-between border-b border-divider bg-surface-bright px-lg py-md">
            <div className="flex items-center gap-sm">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="flex h-5 items-center rounded-full bg-primary px-sm text-xs font-semibold text-on-primary">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-sm">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-xs rounded-md px-sm py-xs text-xs font-medium text-primary transition hover:bg-primary-tint"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-sm text-text-muted transition hover:bg-surface-container-low hover:text-text-primary"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="max-h-[400px] overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center py-2xl text-center">
                <Bell size={40} className="mb-md text-text-muted" />
                <p className="font-semibold text-text-primary">No notifications</p>
                <p className="text-sm text-text-secondary">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-divider">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-divider bg-surface-container-low px-lg py-md">
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-sm text-sm font-semibold text-primary hover:underline"
            >
              View all notifications
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}

type NotificationItemProps = {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
};

function NotificationItem({ notification, onRead, onDelete }: NotificationItemProps) {
  const Icon = NOTIFICATION_ICONS[notification.type];
  const colorClass = NOTIFICATION_COLORS[notification.type];

  return (
    <div
      className={`flex gap-md px-lg py-md transition hover:bg-surface-container-low ${
        !notification.read ? "bg-primary-tint/30" : ""
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-sm">
          <p
            className={`text-sm ${
              !notification.read ? "font-semibold text-text-primary" : "text-text-secondary"
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-xs line-clamp-2 text-xs text-text-muted">
          {notification.message}
        </p>
        <div className="mt-xs flex items-center gap-sm">
          <span className="text-[10px] text-text-muted">
            {formatTime(notification.createdAt)}
          </span>
          <div className="flex items-center gap-xs">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onRead(notification.id)}
                className="rounded p-0.5 text-text-muted transition hover:text-primary"
                aria-label="Mark as read"
              >
                <Check size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="rounded p-0.5 text-text-muted transition hover:text-status-error"
              aria-label="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
