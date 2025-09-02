'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService, User } from '@/lib/services/user.service';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { PostCard } from '@/components/ui/post-card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (username) {
      loadUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (user && activeTab === 'posts') {
      loadUserPosts();
    }
  }, [user, activeTab, currentPage]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user by username (we'll need to implement this or use a different approach)
      // For now, let's assume we can get user by username
      const userData = await UserService.getUserById(username);
      setUser(userData);
      
      // Check if current user is following this user
      if (currentUser && currentUser._id !== userData._id) {
        try {
          const following = await UserService.isFollowing(userData._id);
          setIsFollowing(following);
        } catch (err) {
          // If check fails, assume not following
          setIsFollowing(false);
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      const results = await BlogService.getBlogsByUser(username, currentPage, 12);
      
      if (currentPage === 1) {
        setPosts(results.items);
      } else {
        setPosts(prev => [...prev, ...results.items]);
      }
      
      setPagination(results.pagination);
    } catch (err) {
      console.error('Failed to load user posts:', err);
      toast.error('Failed to load posts');
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !user) return;
    
    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        await UserService.unfollowUser(user._id);
        setIsFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        await UserService.followUser(user._id);
        setIsFollowing(true);
        toast.success('Followed successfully');
      }
    } catch (err) {
      console.error('Follow action failed:', err);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Transform Blog to Post format for PostCard
  const adaptBlogToPost = (blog: Blog) => ({
    id: blog._id,
    title: blog.title,
    excerpt: blog.excerpt || blog.content.substring(0, 150) + '...',
    author: {
      name: blog.author.name,
      avatar: blog.author.avatar || '👤',
      verified: false
    },
    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    readTime: blog.readTime || 1,
    image: blog.coverImage || undefined,
    tags: blog.tags || [],
    likes: blog.likes || 0,
    comments: blog.comments || 0,
    shares: blog.shares || 0,
    isTrending: blog.featured || false,
    slug: blog.slug
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
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

  const isOwnProfile = currentUser && currentUser._id === user._id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ← Back
              </button>
              
              <div className="flex items-center gap-4 flex-1">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 text-xl"
                >
                  {user.avatar || user.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
                  )}
                </div>
              </div>
              
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  variant={isFollowing ? 'outlined' : 'default'}
                >
                  {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
              
              {isOwnProfile && (
                <Link href="/profile">
                  <Button variant="outlined">Edit Profile</Button>
                </Link>
              )}
            </div>
            
                         {/* Stats */}
             <div className="flex items-center gap-8 text-sm">
               <div className="text-center">
                 <div className="font-semibold text-foreground">{posts.length}</div>
                 <div className="text-muted-foreground">Posts</div>
               </div>
               <Link href={`/user/${username}/followers`}>
                 <div className="text-center cursor-pointer hover:text-primary transition-colors">
                   <div className="font-semibold text-foreground">{user.followers || 0}</div>
                   <div className="text-muted-foreground">Followers</div>
                 </div>
               </Link>
               <Link href={`/user/${username}/following`}>
                 <div className="text-center cursor-pointer hover:text-primary transition-colors">
                   <div className="font-semibold text-foreground">{user.following || 0}</div>
                   <div className="text-muted-foreground">Following</div>
                 </div>
               </Link>
               {user.location && (
                 <div className="text-muted-foreground">
                   📍 {user.location}
                 </div>
               )}
               {user.website && (
                 <a
                   href={user.website}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-primary hover:underline"
                 >
                   🌐 Website
                 </a>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'posts'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'about'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'posts' ? (
            <div>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    No posts yet
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {isOwnProfile 
                      ? "You haven't published any posts yet."
                      : `${user.name} hasn't published any posts yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Link href="/create">
                      <Button size="lg">Create Your First Post</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {posts.map((post) => (
                      <Link key={post._id} href={`/blog/${post.slug}`}>
                        <PostCard
                          post={adaptBlogToPost(post)}
                          isLiked={false}
                          onLike={() => {}}
                          onFollow={() => {}}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Load More */}
                  {pagination && pagination.hasNextPage && (
                    <div className="text-center pt-6">
                      <Button
                        onClick={handleLoadMore}
                        variant="outlined"
                      >
                        Load More Posts
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* About Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
                
                {user.bio ? (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    {isOwnProfile 
                      ? "Add a bio to tell others about yourself."
                      : "No bio available."
                    }
                  </p>
                )}
                
                <div className="space-y-3">
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">📍</span>
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">🌐</span>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">📅</span>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.socialLinks.twitter && (
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a
                        href={user.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {user.socialLinks.youtube && (
                      <a
                        href={user.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
