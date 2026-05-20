"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Elegant Toast container floating at top center */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-full bg-[#1B2A4A] border border-[#C9A84C]/30 text-[#FDFBF7] px-5 py-3 shadow-xl transition-all duration-300 animate-slide-down transform hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-accent shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="text-xs font-semibold tracking-tight truncate pr-1">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#FDFBF7]/60 hover:text-white transition-colors cursor-pointer shrink-0 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
