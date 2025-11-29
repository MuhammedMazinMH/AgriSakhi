"use client";

import { useEffect, useState } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
};

let toastCount = 0;

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
  warning: (message: string) => addToast(message, "warning"),
};

const toastCallbacks: ((toast: Toast) => void)[] = [];

function addToast(message: string, type: Toast["type"]) {
  const id = `toast-${toastCount++}`;
  const newToast: Toast = { id, message, type };
  toastCallbacks.forEach((callback) => callback(newToast));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const callback = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };

    toastCallbacks.push(callback);

    return () => {
      const index = toastCallbacks.indexOf(callback);
      if (index > -1) {
        toastCallbacks.splice(index, 1);
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slideIn rounded-lg shadow-lg p-4 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : toast.type === "warning"
              ? "bg-yellow-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
