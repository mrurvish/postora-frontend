import React from 'react';

interface Story {
  id: number;
  user: string;
  avatar: string;
  isLive: boolean;
}

interface StoriesProps {
  stories: Story[];
}

export function Stories({ stories }: StoriesProps) {
  return (
    <section className="py-8 border-b border-border relative overflow-visible">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-4 pt-4 px-4 relative">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0 relative z-10">
              <div className="story-circle relative">
                <span>{story.avatar}</span>
                {story.isLive && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse"></div>
                )}
              </div>
              <span className="text-xs text-muted-foreground text-center max-w-[70px] truncate">
                {story.user}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
