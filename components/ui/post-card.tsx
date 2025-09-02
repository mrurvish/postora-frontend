import React from 'react';
import Image from 'next/image';

interface Author {
  name: string;
  avatar: string;
  verified: boolean;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  readTime: number;
  image?: string; // Make image optional
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isTrending: boolean;
}

interface PostCardProps {
  post: Post;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onFollow: (authorName: string) => void;
}

export function PostCard({ post, isLiked, onLike, onFollow }: PostCardProps) {
  return (
    <article className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 group">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-xl">
          {post.author.avatar || '👤'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{post.author.name}</span>
            {post.author.verified && (
              <span className="text-primary text-sm">✓</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {post.date} • {post.readTime} min read
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isTrending && (
            <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              🔥 Trending
            </div>
          )}
                     <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               onFollow(post.author.name);
             }}
             className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
           >
            Follow
          </button>
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors cursor-pointer">
        {post.title}
      </h3>
      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
      
      {/* Post Image */}
      {post.image ? (
        <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm text-muted-foreground font-medium">Blog Post</p>
          </div>
        </div>
      )}

             {/* Tags */}
       {post.tags && post.tags.length > 0 && (
         <div className="flex flex-wrap gap-2 mb-4">
           {post.tags.slice(0, 3).map((tag) => (
             <button
               key={tag}
               onClick={(e: React.MouseEvent) => {
                 e.preventDefault();
                 e.stopPropagation();
                 window.location.href = `/tag/${tag}`;
               }}
               className="px-3 py-1 bg-muted text-sm text-foreground rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
             >
               #{tag}
             </button>
           ))}
           {post.tags.length > 3 && (
             <span className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full">
               +{post.tags.length - 3} more
             </span>
           )}
         </div>
       )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-6">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike(post.id);
            }}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments}
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {post.shares}
          </button>
        </div>
        
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
