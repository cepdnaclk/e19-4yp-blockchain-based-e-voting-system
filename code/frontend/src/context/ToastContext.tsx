import React, { createContext, useContext, useState, useCallback } from "react";
import type { ToastMessage } from "../components/Toast";

interface ToastContextType {
  showToast: (
    message: string,
    severity?: "error" | "warning" | "info" | "success",
    duration?: number
  ) => void;
  dismissToast: (id: string) => void;
  currentToast: ToastMessage | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (
      message: string,
      severity: "error" | "warning" | "info" | "success" = "error",
      duration: number = 10000
    ) => {
      const id = Date.now().toString();
      const toast: ToastMessage = {
        id,
        message,
        severity,
        duration,
      };
      setCurrentToast(toast);
    },
    []
  );

  const dismissToast = useCallback(() => {
    setCurrentToast(null);
  }, []);

  const value: ToastContextType = {
    showToast,
    dismissToast,
    currentToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
