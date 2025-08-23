import React from 'react';

interface TrendingTopicsProps {
  topics: string[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <div className="social-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Trending Topics</h3>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div key={topic} className="flex items-center justify-between">
            <span className="text-foreground hover:text-primary cursor-pointer transition-colors">
              {topic}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.floor(Math.random() * 1000) + 100} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
