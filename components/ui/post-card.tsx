import React from 'react';
import Image from 'next/image';

interface Author {
  name: string;
  avatar: string;
  verified: boolean;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  readTime: number;
  image: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isTrending: boolean;
}

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  onLike: (postId: number) => void;
  onFollow: (authorName: string) => void;
}

export function PostCard({ post, isLiked, onLike, onFollow }: PostCardProps) {
  return (
    <article className="social-card group relative">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center text-xl">
          {post.author.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{post.author.name}</span>
            {post.author.verified && (
              <span className="text-primary">✓</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {post.date} • {post.readTime} min read
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isTrending && (
            <div className="trending-badge">
              Trending
            </div>
          )}
          <button 
            onClick={() => onFollow(post.author.name)}
            className="follow-btn text-sm flex-shrink-0"
          >
            Follow
          </button>
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
      
      {/* Post Image */}
      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-accent">
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={250}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-accent text-sm text-foreground rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          onClick={() => onLike(post.id)}
          className={`action-btn like ${isLiked ? 'text-like' : ''}`}
        >
          <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likes}
        </button>
        <button className="action-btn comment">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments}
        </button>
        <button className="action-btn share">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          {post.shares}
        </button>
      </div>
    </article>
  );
}
