"use client";
import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { H3, P, Muted } from '@/components/ui/text';
import { useProfileStore, useToast } from '@/lib';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProfileUpdate: () => void;
}

export function EditProfileDialog({ isOpen, onClose, user, onProfileUpdate }: EditProfileDialogProps) {
  const { updateProfile } = useProfileStore();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    website: user.website || '',
    location: user.location || '',
    socialLinks: {
      twitter: user.socialLinks?.twitter || '',
      facebook: user.socialLinks?.facebook || '',
      linkedin: user.socialLinks?.linkedin || '',
      instagram: user.socialLinks?.instagram || '',
      youtube: user.socialLinks?.youtube || ''
    },
    preferences: {
      emailNotifications: user.preferences?.emailNotifications ?? true,
      pushNotifications: user.preferences?.pushNotifications ?? true,
      newsletter: user.preferences?.newsletter ?? true,
      theme: user.preferences?.theme || 'system'
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Update the user profile using the profile store
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success(result.message);
        onProfileUpdate();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <H3>Edit Profile</H3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <H3 className="text-lg">Personal Information</H3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <H3 className="text-lg">Social Links</H3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-foreground mb-2">
                  Twitter
                </label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-foreground mb-2">
                  Facebook
                </label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/username"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn
                </label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-foreground mb-2">
                  Instagram
                </label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-foreground mb-2">
                  YouTube
                </label>
                <Input
                  id="youtube"
                  type="url"
                  placeholder="https://youtube.com/@username"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <H3 className="text-lg">Preferences</H3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-foreground mb-2">
                  Theme
                </label>
                <select
                  id="theme"
                  value={formData.preferences.theme}
                  onChange={(e) => handleInputChange('preferences.theme', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={formData.preferences.emailNotifications}
                  onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 text-sm text-foreground">
                  Email Notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="pushNotifications"
                  type="checkbox"
                  checked={formData.preferences.pushNotifications}
                  onChange={(e) => handleInputChange('preferences.pushNotifications', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="pushNotifications" className="ml-2 text-sm text-foreground">
                  Push Notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={formData.preferences.newsletter}
                  onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 text-sm text-foreground">
                  Newsletter Subscription
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
