"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './ui/brand-logo';
import { Button } from './ui/button';
import { AuthDialog } from './ui/auth-dialog';
import { ThemeToggle } from './theme-toggle';
import { H4, Muted } from './ui/text';
import { BRAND_CONFIG } from '@/lib/config';

export function Navigation() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthDialog = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <BrandLogo logoLetter={BRAND_CONFIG.name.charAt(0)} />
              <H4 className="hidden sm:block">Postora</H4>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center space-x-3">
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
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-md hover:bg-accent transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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
