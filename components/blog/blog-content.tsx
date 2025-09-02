import React from 'react';
import Image from 'next/image';
import { Blog } from '@/lib/services/blog.service';

interface BlogContentProps {
  blog: Blog;
}

export function BlogContent({ blog }: BlogContentProps) {
  return (
    <article className="prose prose-lg max-w-none">
      {/* Featured Image */}
      {blog.coverImage && (
        <div className="mb-8">
          <div className="aspect-video rounded-xl overflow-hidden bg-muted">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="text-foreground leading-relaxed">
        {/* Convert content to HTML if it's markdown, or render as plain text */}
        {blog.content.includes('<') ? (
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-foreground"
          />
        ) : (
          <div className="whitespace-pre-wrap text-muted-foreground">
            {blog.content}
          </div>
        )}
      </div>

      {/* SEO Meta Info (hidden) */}
      {blog.seo && (
        <div className="sr-only">
          <meta property="og:title" content={blog.seo.metaTitle || blog.title} />
          <meta property="og:description" content={blog.seo.metaDescription || blog.excerpt} />
          <meta property="og:image" content={blog.seo.ogImage || blog.coverImage} />
          <meta property="og:url" content={blog.seo.canonicalUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blog.seo.ogTitle || blog.title} />
          <meta name="twitter:description" content={blog.seo.ogDescription || blog.excerpt} />
          <meta name="twitter:image" content={blog.seo.ogImage || blog.coverImage} />
        </div>
      )}
    </article>
  );
}
