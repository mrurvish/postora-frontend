"use client";
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { SubmitButton } from './submit-button';
import { DemoCredentials } from './demo-credentials';
import { PasswordStrengthIndicator } from './password-strength';
import { TermsCheckbox } from './terms-checkbox';
import { H3, Body, Muted, Label } from './text';
import { BRAND_CONFIG } from '@/lib/config';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthDialog({ isOpen, onClose, initialMode = 'login' }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  // Prevent body scroll and make site content inaccessible when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <>
      {/* Backdrop with light blur - makes site content inaccessible */}
      <div 
        className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
        <div className="relative w-full max-w-md max-h-[90vh] border-2 border-border rounded-2xl shadow-2xl flex flex-col" style={{ 
          pointerEvents: 'auto',
          backgroundColor: 'hsl(var(--card))'
        }}>
          {/* Header - Compact */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-border/50">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl text-background font-bold">
                  {BRAND_CONFIG.name.charAt(0)}
                </span>
              </div>
              <H3 className="mb-1">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </H3>
              <Muted>
                {mode === 'login' 
                  ? 'Sign in to your account to continue' 
                  : 'Join our community and start sharing'
                }
              </Muted>
            </div>
          </div>

          {/* Scrollable Content - Hidden scrollbar */}
          <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-hide">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {mode === 'register' && <PasswordStrengthIndicator password={formData.password} />}
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {mode === 'register' && (
                <TermsCheckbox 
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
              )}

              <SubmitButton
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </SubmitButton>
            </form>

            {/* Demo creds */}
            {mode === 'login' && (
              <div className="mt-5">
                <DemoCredentials 
                  email="demo@example.com"
                  password="demo123"
                />
              </div>
            )}

            {/* Switch */}
            <div className="text-center mt-5">
              <Muted>
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary hover:text-primary/80 font-medium ml-1 transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </Muted>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
