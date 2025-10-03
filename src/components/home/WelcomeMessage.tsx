import { cn } from '@/lib/utils';
import type { WelcomeMessageProps } from '@/types/statusCards';

/**
 * Welcome message component for the home page
 * Features:
 * - 24px font size as specified
 * - Wave emoji support
 * - Responsive design
 * - Positioned at top-left of content space
 */
export function WelcomeMessage({ 
  userName = 'User', 
  showWaveEmoji = true, 
  className 
}: WelcomeMessageProps) {
  return (
    <div className={cn('flex flex-col space-y-1 mb-6', className)}>
      <h1 
        className="text-2xl font-semibold text-foreground"
        style={{ fontSize: '24px' }}
        aria-label={`Welcome back ${userName}`}
      >
        Welcome back, {userName}!
        {showWaveEmoji && (
          <span 
            className="ml-2" 
            role="img" 
            aria-label="waving hand"
          >
            👋🏻
          </span>
        )}
      </h1>
      <p className="text-muted-foreground text-sm">
        Here's an overview of your research space
      </p>
    </div>
  );
}