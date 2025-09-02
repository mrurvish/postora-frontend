'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService, User } from '@/lib/services/user.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export default function UserFollowersPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (username) {
      loadUserAndFollowers();
    }
  }, [username, currentPage]);

  const loadUserAndFollowers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user by username
      const userData = await UserService.getUserById(username);
      setUser(userData);
      
      // Get followers
      const followersData = await UserService.getUserFollowers(userData._id, currentPage, 20);
      
      if (currentPage === 1) {
        setFollowers(followersData.items);
      } else {
        setFollowers(prev => [...prev, ...followersData.items]);
      }
      
      setPagination(followersData.pagination);
      
      // Check follow states for current user
      if (currentUser) {
        const followStatesData: Record<string, boolean> = {};
        for (const follower of followersData.items) {
          if (follower._id !== currentUser._id) {
            try {
              const isFollowing = await UserService.isFollowing(follower._id);
              followStatesData[follower._id] = isFollowing;
            } catch (err) {
              followStatesData[follower._id] = false;
            }
          }
        }
        setFollowStates(prev => ({ ...prev, ...followStatesData }));
      }
    } catch (err) {
      console.error('Failed to load followers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;
    
    try {
      const isCurrentlyFollowing = followStates[userId];
      
      if (isCurrentlyFollowing) {
        await UserService.unfollowUser(userId);
        setFollowStates(prev => ({ ...prev, [userId]: false }));
        toast.success('Unfollowed successfully');
      } else {
        await UserService.followUser(userId);
        setFollowStates(prev => ({ ...prev, [userId]: true }));
        toast.success('Followed successfully');
      }
    } catch (err) {
      console.error('Follow action failed:', err);
      toast.error('Failed to update follow status');
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading followers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              User not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The user "{username}" doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ← Back
              </button>
              
              <div className="flex items-center gap-4">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 text-lg"
                >
                  {user.avatar || user.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <div>
                  <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm">
              <Link href={`/user/${username}`}>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                  Posts
                </span>
              </Link>
              <Link href={`/user/${username}/followers`}>
                <span className="text-primary font-medium">
                  {pagination?.total || followers.length} Followers
                </span>
              </Link>
              <Link href={`/user/${username}/following`}>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                  Following
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {followers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No followers yet
              </h2>
              <p className="text-muted-foreground mb-6">
                {user.name} doesn't have any followers yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div
                  key={follower._id}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <Avatar
                    src={follower.avatar}
                    alt={follower.name}
                    className="w-12 h-12 text-lg"
                  >
                    {follower.avatar || follower.name.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <div className="flex-1">
                    <Link href={`/user/${follower.username}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                        {follower.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">@{follower.username}</p>
                    {follower.bio && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {follower.bio}
                      </p>
                    )}
                  </div>
                  
                  {currentUser && follower._id !== currentUser._id && (
                    <Button
                      onClick={() => handleFollow(follower._id)}
                      variant={followStates[follower._id] ? 'outlined' : 'default'}
                      size="sm"
                    >
                      {followStates[follower._id] ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))}

              {/* Load More */}
              {pagination && pagination.hasNextPage && (
                <div className="text-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outlined"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
