import React from 'react';
import { cn } from '@/lib/utils';

export interface PasswordStrengthProps {
  password: string;
  variant?: 'default' | 'minimal' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  variant = 'default',
  size = 'md',
  showScore = true,
  className 
}: PasswordStrengthProps) {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';
    const color = score < 2 ? 'text-destructive' : score < 4 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400';
    const bgColor = score < 2 ? 'bg-destructive' : score < 4 ? 'bg-yellow-500' : 'bg-green-500';

    return { score, strength, color, bgColor, feedback };
  };

  const { score, strength, color, bgColor, feedback } = getPasswordStrength(password);

  const variants = {
    default: 'p-4 bg-muted/50 rounded-xl border border-border',
    minimal: 'p-2 bg-transparent',
    detailed: 'p-4 bg-muted/50 rounded-xl border border-border'
  };

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn('h-full transition-all duration-300', bgColor)}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        {showScore && (
          <span className={cn('text-xs font-medium', color)}>
            {strength}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'transition-all duration-300',
      variants[variant],
      sizes[size],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">Password Strength</span>
        {showScore && (
          <span className={cn('text-xs font-medium', color)}>
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </span>
        )}
      </div>
      
      <div className="flex space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              index <= score ? bgColor : 'bg-muted'
            )}
          />
        ))}
      </div>

      {variant === 'detailed' && feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-center text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2" />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
