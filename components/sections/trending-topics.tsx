import React from 'react';

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="social-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trending Topics</h3>
        <p className="text-muted-foreground text-sm">No trending topics available</p>
      </div>
    );
  }

  return (
    <div className="social-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Trending Topics</h3>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between group">
            <span className="text-foreground hover:text-primary cursor-pointer transition-colors">
              #{topic.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {topic.count.toLocaleString()} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
