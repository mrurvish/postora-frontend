import React from 'react';

interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  verified: boolean;
}

interface SuggestedUsersProps {
  users: User[];
  followedUsers: Set<number>;
  onFollow: (userId: number) => void;
}

export function SuggestedUsers({ users, followedUsers, onFollow }: SuggestedUsersProps) {
  return (
    <div className="social-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Suggested for You</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center text-xl">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">{user.name}</span>
                {user.verified && (
                  <span className="text-primary text-sm">✓</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
              <p className="text-xs text-muted-foreground">{user.followers}k followers</p>
            </div>
            <button
              onClick={() => onFollow(user.id)}
              className={`follow-btn text-sm ${followedUsers.has(user.id) ? 'following' : ''}`}
            >
              {followedUsers.has(user.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
