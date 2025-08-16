"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: '☀️',
      description: 'Light theme'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: '🌙',
      description: 'Dark theme'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: '💻',
      description: 'System preference'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-2 rounded-xl bg-card border border-border text-foreground hover:bg-secondary transition-all duration-300 shadow-soft hover:shadow-medium"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg transform transition-transform duration-300 group-hover:scale-110">
            {currentTheme.icon}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card rounded-2xl shadow-strong border border-border overflow-hidden z-50">
          <div className="py-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 hover:bg-secondary ${
                  theme === themeOption.value
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
                suppressHydrationWarning
              >
                <span className="text-lg">{themeOption.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                </div>
                {theme === themeOption.value && (
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
