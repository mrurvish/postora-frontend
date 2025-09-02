"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { H4 } from '@/components/ui/text';

interface ProfileTabsProps {
  activeTab: 'profile' | 'posts' | 'drafts' | 'create';
  onTabChange: (tab: 'profile' | 'posts' | 'drafts' | 'create') => void;
  stats: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
  };
}

export function ProfileTabs({ activeTab, onTabChange, stats }: ProfileTabsProps) {
  const tabs = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      count: null
    },
    {
      id: 'posts' as const,
      label: 'Published Posts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      count: stats.totalPosts
    },
    {
      id: 'drafts' as const,
      label: 'Drafts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      count: null
    },
    {
      id: 'create' as const,
      label: 'Create Post',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      count: null
    }
  ];

  return (
    <div className="border-b border-border mb-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="ml-2 px-2 py-1 text-xs bg-background/20 rounded-full">
                {tab.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
