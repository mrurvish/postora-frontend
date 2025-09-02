"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './ui/brand-logo';
import { Button } from './ui/button';
import { AuthDialog } from './ui/auth-dialog';
import { ThemeToggle } from './theme-toggle';
import { H4, Muted } from './ui/text';
import { BRAND_CONFIG } from '@/lib/config';
import { useAuthStore } from '@/lib';
import { useToast } from '@/lib/providers/toast-provider';
import { SearchBar } from '@/components/ui/search-bar';

export function Navigation() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const pathname = usePathname();
  
  // Get auth state and functions
  const { user, isAuthenticated, logout } = useAuthStore();
  const toast = useToast();

  const openAuthDialog = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  // Check if user is on profile page
  const isOnProfilePage = pathname === '/profile';

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BrandLogo logoLetter={BRAND_CONFIG.name.charAt(0)} href="/" />
              <H4 className="hidden sm:block">Postora</H4>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar 
                placeholder="Search posts, users, topics..."
                className="w-full"
                onResultClick={(result) => {
                  if (result.slug) {
                    window.location.href = `/blog/${result.slug}`;
                  } else if (result.username) {
                    window.location.href = `/user/${result.username}`;
                  }
                }}
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Search Link - Mobile */}
              <Link href="/search" className="md:hidden">
                <Button variant="ghost" size="sm">
                  🔍
                </Button>
              </Link>
              
              {/* Auth Buttons - Show different UI based on auth state */}
              <div className="hidden sm:flex items-center space-x-3">
                {user ? (
                  // User is authenticated
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.name}
                    </span>
                    <Link href="/my-posts">
                      <Button variant="ghost" className="text-foreground hover:text-primary">
                        My Posts
                      </Button>
                    </Link>
                    <Link href="/bookmarks">
                      <Button variant="ghost" className="text-foreground hover:text-primary">
                        Bookmarks
                      </Button>
                    </Link>
                    {!isOnProfilePage && (
                      <Link href="/profile">
                        <Button variant="ghost" className="text-foreground hover:text-primary">
                          Profile
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-foreground hover:text-primary"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  // User is not authenticated
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => openAuthDialog('login')}
                      className="text-foreground hover:text-primary"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => openAuthDialog('register')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </div>


            </div>
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={closeAuthDialog}
        initialMode={authMode}
      />
    </>
  );
}
