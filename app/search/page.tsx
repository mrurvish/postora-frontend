'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchService, SearchFilters } from '@/lib/services/search.service';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { UserService, User } from '@/lib/services/user.service';
import { PostCard } from '@/components/ui/post-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/text';
import { SearchBar } from '@/components/ui/search-bar';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<'all' | 'blogs' | 'users'>('all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'Technology', 'Design', 'Business', 'Lifestyle', 'Travel', 
    'Food', 'Health', 'Education', 'Entertainment', 'General'
  ];

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, searchType, category, sortBy, sortOrder, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (searchType === 'all' || searchType === 'blogs') {
        const blogResults = await SearchService.searchBlogs(query, currentPage, 12, {
          category: category || undefined,
          sortBy,
          sortOrder
        });
        setBlogs(blogResults.items);
        setPagination(blogResults.pagination);
      }

      if (searchType === 'all' || searchType === 'users') {
        const userResults = await SearchService.searchUsers(query, currentPage, 12, {
          sortBy: sortBy === 'popularity' ? 'followers' : 'name',
          sortOrder
        });
        setUsers(userResults.items);
        if (searchType === 'users') {
          setPagination(userResults.pagination);
        }
      }

      // Update URL with search parameters
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (searchType !== 'all') params.set('type', searchType);
      if (sortBy !== 'relevance') params.set('sortBy', sortBy);
      if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
      
      router.push(`/search?${params.toString()}`);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory === category ? '' : selectedCategory);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const clearFilters = () => {
    setQuery('');
    setSearchType('all');
    setCategory('');
    setSortBy('relevance');
    setSortOrder('desc');
    setCurrentPage(1);
    router.push('/search');
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

  const hasResults = blogs.length > 0 || users.length > 0;
  const hasFilters = query || category || searchType !== 'all' || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Search</h1>
            
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                placeholder="Search posts, users, topics..."
                onResultClick={(result) => {
                  if (result.slug) {
                    router.push(`/blog/${result.slug}`);
                  } else if (result.username) {
                    router.push(`/user/${result.username}`);
                  }
                }}
              />
            </div>

            {/* Active Search Info */}
            {query && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-muted-foreground">
                  {hasResults ? (
                    <span>
                      Found {blogs.length + users.length} results for "{query}"
                    </span>
                  ) : !loading ? (
                    <span>No results found for "{query}"</span>
                  ) : null}
                </div>
                {hasFilters && (
                  <Button variant="outlined" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Search Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Search Type</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Content' },
                      { value: 'blogs', label: 'Posts Only' },
                      { value: 'users', label: 'Users Only' }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={type.value}
                          checked={searchType === type.value}
                          onChange={(e) => setSearchType(e.target.value as any)}
                          className="text-primary"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          category === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                  
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading && currentPage === 1 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Searching...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={performSearch}>Try Again</Button>
                </div>
              ) : !query ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Start Searching
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Enter a search term to find posts, users, and topics
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😕</div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    No results found
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Blog Results */}
                  {(searchType === 'all' || searchType === 'blogs') && blogs.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-4">
                        Posts ({blogs.length})
                      </h2>
                      <div className="grid gap-6">
                        {blogs.map((blog) => (
                          <Link key={blog._id} href={`/blog/${blog.slug}`}>
                            <PostCard
                              post={adaptBlogToPost(blog)}
                              isLiked={false}
                              onLike={() => {}}
                              onFollow={() => {}}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                                     {/* User Results */}
                   {(searchType === 'all' || searchType === 'users') && users.length > 0 && (
                     <div>
                       <h2 className="text-xl font-semibold text-foreground mb-4">
                         Users ({users.length})
                       </h2>
                       <div className="grid gap-4">
                         {users.map((user) => (
                           <Link key={user._id} href={`/user/${user.username}`}>
                             <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                               <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-xl">
                                 {user.avatar || '👤'}
                               </div>
                               <div className="flex-1">
                                 <h3 className="font-semibold text-foreground">{user.name}</h3>
                                 <p className="text-sm text-muted-foreground">@{user.username}</p>
                                 {user.bio && (
                                   <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                     {user.bio}
                                   </p>
                                 )}
                               </div>
                               <Button variant="outlined" size="sm">
                                 View Profile
                               </Button>
                             </div>
                           </Link>
                         ))}
                       </div>
                     </div>
                   )}

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
      </div>
    </div>
  );
}
