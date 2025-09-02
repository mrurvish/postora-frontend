"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/lib';

export function AuthInitializer() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    getCurrentUser();
  }, [getCurrentUser]);

  // This component doesn't render anything
  return null;
}

