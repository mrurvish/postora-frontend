import React from 'react';
import { Button } from './button';

export interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  type?: 'submit' | 'button';
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SubmitButton({ 
  children, 
  isLoading = false, 
  loadingText = "Loading...",
  disabled = false,
  className = "",
  type = "submit",
  variant = "filled",
  size = "lg"
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled}
      className={`w-full ${className}`}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
}
