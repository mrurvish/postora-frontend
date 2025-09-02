"use client";
import React, { useState, useEffect } from 'react';
import { useAuthStore, useProfileStore } from '@/lib';
import { useToast } from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { H1, H2, H3, P, Muted, Label } from '@/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SubmitButton } from '@/components/ui/submit-button';

interface ProfileData {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  bio?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  stats: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
  };
  createdAt: string;
  lastLogin: string;
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore();
  const { profile, getCurrentUserProfile, updateProfile } = useProfileStore();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    avatar: '',
    socialLinks: {
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      newsletter: false
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        socialLinks: {
          twitter: profile.socialLinks?.twitter || '',
          facebook: profile.socialLinks?.facebook || '',
          linkedin: profile.socialLinks?.linkedin || '',
          instagram: profile.socialLinks?.instagram || '',
          youtube: profile.socialLinks?.youtube || ''
        },
        preferences: {
          emailNotifications: profile.preferences?.emailNotifications ?? true,
          pushNotifications: profile.preferences?.pushNotifications ?? true,
          newsletter: profile.preferences?.newsletter ?? false
        }
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      await getCurrentUserProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const result = await updateProfile(editForm);
      
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        await loadProfile(); // Reload profile data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Show sign-in message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <H1 className="mb-4">Please sign in to view your profile</H1>
          <Muted>You need to be signed in to access your profile.</Muted>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <P className="mt-4">Loading your profile...</P>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <H1 className="mb-4">Profile not found</H1>
          <Muted>Unable to load your profile data.</Muted>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <H1 className="mb-2">Profile</H1>
          <Muted>Manage your account settings and preferences</Muted>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <H2>Profile Information</H2>
                <Button
                  variant={isEditing ? "outlined" : "filled"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={editForm.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="space-y-4">
                    <H3>Social Links</H3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={editForm.socialLinks.twitter}
                          onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={editForm.socialLinks.linkedin}
                          onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                          placeholder="username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={editForm.socialLinks.instagram}
                          onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                          id="youtube"
                          value={editForm.socialLinks.youtube}
                          onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                          placeholder="@channel"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <H3>Preferences</H3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={editForm.preferences.emailNotifications}
                          onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={editForm.preferences.pushNotifications}
                          onChange={(e) => handleInputChange('preferences.pushNotifications', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newsletter">Newsletter</Label>
                        <input
                          type="checkbox"
                          id="newsletter"
                          checked={editForm.preferences.newsletter}
                          onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar 
                      src={profile.avatar} 
                      alt={profile.name}
                      fallback={profile.name.charAt(0).toUpperCase()}
                      className="w-20 h-20"
                      size="xl"
                    />
                    <div>
                      <H3>{profile.name}</H3>
                      <Muted>@{profile.username}</Muted>
                      <P className="text-sm text-muted-foreground">{profile.email}</P>
                    </div>
                  </div>

                  {profile.bio && (
                    <div>
                      <Label>Bio</Label>
                      <P className="mt-1">{profile.bio}</P>
                    </div>
                  )}

                  {/* Social Links */}
                  {(profile.socialLinks.twitter || profile.socialLinks.linkedin || 
                    profile.socialLinks.instagram || profile.socialLinks.youtube) && (
                    <div>
                      <Label>Social Links</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.socialLinks.twitter && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            Twitter: {profile.socialLinks.twitter}
                          </span>
                        )}
                        {profile.socialLinks.linkedin && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            LinkedIn: {profile.socialLinks.linkedin}
                          </span>
                        )}
                        {profile.socialLinks.instagram && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-sm">
                            Instagram: {profile.socialLinks.instagram}
                          </span>
                        )}
                        {profile.socialLinks.youtube && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                            YouTube: {profile.socialLinks.youtube}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Stats Card */}
            <Card className="p-6">
              <H2 className="mb-4">Statistics</H2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <H3 className="text-2xl text-primary">{profile.stats.totalPosts}</H3>
                  <Muted>Posts</Muted>
                </div>
                <div className="text-center">
                  <H3 className="text-2xl text-primary">{profile.stats.totalLikes}</H3>
                  <Muted>Likes</Muted>
                </div>
                <div className="text-center">
                  <H3 className="text-2xl text-primary">{profile.stats.totalComments}</H3>
                  <Muted>Comments</Muted>
                </div>
                <div className="text-center">
                  <H3 className="text-2xl text-primary">{profile.stats.followers}</H3>
                  <Muted>Followers</Muted>
                </div>
                <div className="text-center">
                  <H3 className="text-2xl text-primary">{profile.stats.following}</H3>
                  <Muted>Following</Muted>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="p-6">
              <H3 className="mb-4">Account Information</H3>
              <div className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <P className="capitalize">{profile.role}</P>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <P>{profile.isActive ? 'Active' : 'Inactive'}</P>
                  </div>
                </div>
                <div>
                  <Label>Verification</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <P>{profile.isVerified ? 'Verified' : 'Not Verified'}</P>
                  </div>
                </div>
                <div>
                  <Label>Member Since</Label>
                  <P>{new Date(profile.createdAt).toLocaleDateString()}</P>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <P>{profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}</P>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-6">
              <H3 className="mb-4">Preferences</H3>
              <div className="space-y-3">
                <div>
                  <Label>Email Notifications</Label>
                  <P className="mt-1">{profile.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}</P>
                </div>
                <div>
                  <Label>Push Notifications</Label>
                  <P className="mt-1">{profile.preferences?.pushNotifications ? 'Enabled' : 'Disabled'}</P>
                </div>
                <div>
                  <Label>Newsletter</Label>
                  <P className="mt-1">{profile.preferences?.newsletter ? 'Subscribed' : 'Not Subscribed'}</P>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
