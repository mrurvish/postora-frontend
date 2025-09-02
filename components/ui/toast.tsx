'use client';

import React from 'react';
import { Toast } from '@/lib/hooks/use-toast';
import { useToast } from '@/lib/providers/toast-provider';

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastComponent({ toast, onRemove }: ToastProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        bg-card border border-border rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-right-full
      `}
    >
      <div className="flex items-start p-4">
        <div className={`flex-shrink-0 w-6 h-6 ${getBgColor()} rounded-full flex items-center justify-center text-white text-sm`}>
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-foreground">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-muted-foreground">
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// Toaster component for the layout
export function Toaster() {
  const { toasts, removeToast } = useToast();
  
  return (
    <ToastContainer 
      toasts={toasts} 
      onRemove={removeToast} 
    />
  );
}
