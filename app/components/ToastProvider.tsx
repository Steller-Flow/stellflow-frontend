"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      containerStyle={{ bottom: 24, right: 24 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-card-bg)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-status-success)",
            secondary: "var(--color-on-primary)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-status-error)",
            secondary: "var(--color-on-primary)",
          },
          duration: 6000,
        },
      }}
    />
  );
}
