"use client";
import React from 'react';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { H3, P, Muted } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

interface ProfileInfoProps {
  user: User;
  onProfileUpdate: () => void;
}

export function ProfileInfo({ user, onProfileUpdate }: ProfileInfoProps) {
  const socialLinks = [
    { name: 'Twitter', url: user.socialLinks?.twitter, icon: '🐦' },
    { name: 'Facebook', url: user.socialLinks?.facebook, icon: '📘' },
    { name: 'LinkedIn', url: user.socialLinks?.linkedin, icon: '💼' },
    { name: 'Instagram', url: user.socialLinks?.instagram, icon: '📷' },
    { name: 'YouTube', url: user.socialLinks?.youtube, icon: '📺' }
  ].filter(link => link.url);

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card className="p-6">
        <H3 className="mb-4">Personal Information</H3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Muted className="text-sm font-medium mb-2">Full Name</Muted>
            <P>{user.name}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Username</Muted>
            <P>@{user.username}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Email</Muted>
            <P>{user.email}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Role</Muted>
            <P className="capitalize">{user.role}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Location</Muted>
            <P>{user.location || 'Not specified'}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Website</Muted>
            <P>
              {user.website ? (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              ) : (
                'Not specified'
              )}
            </P>
          </div>
        </div>
        {user.bio && (
          <div className="mt-6">
            <Muted className="text-sm font-medium mb-2">Bio</Muted>
            <P>{user.bio}</P>
          </div>
        )}
      </Card>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <Card className="p-6">
          <H3 className="mb-4">Social Links</H3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((link) => (
              <div key={link.name} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1">
                  <Muted className="text-sm font-medium">{link.name}</Muted>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm block truncate"
                  >
                    {link.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preferences */}
      <Card className="p-6">
        <H3 className="mb-4">Preferences</H3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Muted className="text-sm font-medium mb-2">Theme</Muted>
            <P className="capitalize">{user.preferences?.theme || 'system'}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Email Notifications</Muted>
            <P>{user.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Push Notifications</Muted>
            <P>{user.preferences?.pushNotifications ? 'Enabled' : 'Disabled'}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Newsletter</Muted>
            <P>{user.preferences?.newsletter ? 'Subscribed' : 'Not subscribed'}</P>
          </div>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <H3 className="mb-4">Account Information</H3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Muted className="text-sm font-medium mb-2">Account Status</Muted>
            <P className={user.isActive ? 'text-green-600' : 'text-red-600'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Verification Status</Muted>
            <P className={user.isVerified ? 'text-green-600' : 'text-yellow-600'}>
              {user.isVerified ? 'Verified' : 'Not verified'}
            </P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Member Since</Muted>
            <P>{new Date(user.createdAt).toLocaleDateString()}</P>
          </div>
          <div>
            <Muted className="text-sm font-medium mb-2">Last Login</Muted>
            <P>
              {user.lastLogin 
                ? new Date(user.lastLogin).toLocaleDateString() 
                : 'Never'
              }
            </P>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Button onClick={onProfileUpdate} size="lg">
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
