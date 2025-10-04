import React from 'react';
import { StatusCard } from './StatusCard';
import { cn } from '@/lib/utils';
import type { StatusGridProps } from '@/types/statusCards';

/**
 * StatusGrid component for organizing status cards in responsive layout
 * Features:
 * - Responsive grid (1 column mobile, 2 tablet, 4 desktop)
 * - Proper spacing and alignment
 * - Performance optimized with React.memo
 * - Accessibility navigation between cards
 */
export const StatusGrid = React.memo(function StatusGrid({ 
  cards, 
  onCardClick 
}: StatusGridProps) {
  return (
    <div 
      className={cn(
        'grid grid-cols-1 gap-4',
        'sm:grid-cols-2',
        'lg:grid-cols-4',
        'w-full'
      )}
      role="grid"
      aria-label="Dashboard status cards"
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          role="gridcell"
          aria-rowindex={Math.floor(index / 4) + 1}
          aria-colindex={(index % 4) + 1}
        >
          <StatusCard
            card={card}
            onClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
});