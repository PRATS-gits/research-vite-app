import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatusCardProps } from '@/types/statusCards';

/**
 * StatusCard component for displaying dashboard metrics
 * Features:
 * - Clickable navigation
 * - Hover effects and interaction states
 * - Status indicators with color coding
 * - Accessibility compliance (ARIA labels, keyboard navigation)
 * - <100ms interaction response performance target
 */
export function StatusCard({ card, onClick }: StatusCardProps) {
  const handleClick = () => {
    onClick(card.navigateTo);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(card.navigateTo);
    }
  };

  const getStatusColor = () => {
    switch (card.status) {
      case 'operational':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCardColorClasses = () => {
    switch (card.color) {
      case 'blue':
        return 'hover:border-blue-300 hover:shadow-blue-100';
      case 'green':
        return 'hover:border-green-300 hover:shadow-green-100';
      case 'yellow':
        return 'hover:border-yellow-300 hover:shadow-yellow-100';
      case 'red':
        return 'hover:border-red-300 hover:shadow-red-100';
      default:
        return 'hover:border-gray-300 hover:shadow-gray-100';
    }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-150 ease-in-out',
        'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        getCardColorClasses()
      )}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${card.title} page. Current value: ${card.value}. Status: ${card.status}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div
            className={cn('w-2 h-2 rounded-full', getStatusColor())}
            aria-label={`Status: ${card.status}`}
          />
          <span className="text-lg" aria-hidden="true">
            {card.icon}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {card.value}
        </div>
        <p className="text-xs text-muted-foreground">
          {card.description}
        </p>
      </CardContent>
    </Card>
  );
}