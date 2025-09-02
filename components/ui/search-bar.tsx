"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SearchService } from '@/lib/services/search.service';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Button } from './button';
import { Input } from './input';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: any) => void;
}

export function SearchBar({ placeholder = "Search posts, users, topics...", className = "", onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Perform search when query changes
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      performSearch();
    } else {
      setSearchResults(null);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const performSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await SearchService.globalSearch({
        query: debouncedQuery,
        page: 1,
        limit: 10,
        includeBlogs: true,
        includeUsers: true,
        includeTopics: true,
        sortBy: 'relevance'
      });
      setSearchResults(results);
      setIsOpen(true);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < (searchResults?.totalResults || 0) - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && searchResults) {
            const allResults = [
              ...(searchResults.blogs || []),
              ...(searchResults.users || []),
              ...(searchResults.topics || [])
            ];
            if (allResults[focusedIndex]) {
              handleResultClick(allResults[focusedIndex]);
            }
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, searchResults]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 2);
    setFocusedIndex(-1);
  };

  const handleResultClick = (result: any) => {
    onResultClick?.(result);
    setIsOpen(false);
    setFocusedIndex(-1);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const hasResults = searchResults && (
    (searchResults.blogs && searchResults.blogs.length > 0) ||
    (searchResults.users && searchResults.users.length > 0) ||
    (searchResults.topics && searchResults.topics.length > 0)
  );

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              Search failed. Please try again.
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {/* Blogs */}
              {searchResults?.blogs && searchResults.blogs.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground bg-muted/50">
                    Posts
                  </div>
                  {searchResults.blogs.map((blog, index) => (
                    <button
                      key={`blog-${blog._id}`}
                      onClick={() => handleResultClick(blog)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                        focusedIndex === index ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="font-medium text-foreground">{blog.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {blog.excerpt}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Users */}
              {searchResults?.users && searchResults.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground bg-muted/50">
                    Users
                  </div>
                  {searchResults.users.map((user, index) => (
                    <button
                      key={`user-${user._id}`}
                      onClick={() => handleResultClick(user)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                        focusedIndex === (searchResults.blogs?.length || 0) + index ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Topics */}
              {searchResults?.topics && searchResults.topics.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground bg-muted/50">
                    Topics
                  </div>
                  {searchResults.topics.map((topic, index) => (
                    <button
                      key={`topic-${topic._id}`}
                      onClick={() => handleResultClick(topic)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                        focusedIndex === (searchResults.blogs?.length || 0) + (searchResults.users?.length || 0) + index ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="font-medium text-foreground">#{topic.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {topic.postCount} posts
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
