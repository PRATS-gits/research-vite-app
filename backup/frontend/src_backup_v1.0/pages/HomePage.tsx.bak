import { useMemo } from 'react';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import { StatusGrid } from '@/components/home/StatusGrid';
import { useNavigateToPage } from '@/hooks/useNavigateToPage';
import type { StatusCard } from '@/types/statusCards';

/**
 * HomePage component - Dashboard with welcome message and status cards
 * Features:
 * - Welcome message with user greeting and wave emoji
 * - Status cards for Library, Agents, Connections, and Status
 * - Clickable navigation to respective pages
 * - Responsive layout and accessibility compliance
 * - Performance optimized with useMemo for static data
 */
export function HomePage() {
  const navigateToPage = useNavigateToPage();

  // Memoized status cards data to prevent unnecessary re-renders
  const statusCards: StatusCard[] = useMemo(() => [
    {
      id: 'library',
      type: 'library',
      title: 'Library',
      value: 247,
      description: 'Documents and resources',
      icon: '📚',
      navigateTo: '/library',
      status: 'operational',
      color: 'blue'
    },
    {
      id: 'agents',
      type: 'agents',
      title: 'Agents',
      value: 3,
      description: 'Active AI assistants',
      icon: '🤖',
      navigateTo: '/agents',
      status: 'operational',
      color: 'green'
    },
    {
      id: 'connections',
      type: 'connections',
      title: 'Connections',
      value: '2/3',
      description: 'Cloud services connected',
      icon: '🔗',
      navigateTo: '/connections',
      status: 'warning',
      color: 'yellow'
    },
    {
      id: 'status',
      type: 'status',
      title: 'Status',
      value: 'Operational',
      description: 'System health check',
      icon: '⚡',
      navigateTo: '/status',
      status: 'operational',
      color: 'green'
    }
  ], []);

  const handleCardClick = (navigateTo: string) => {
    navigateToPage(navigateTo);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Message - positioned at top-left as specified */}
      <WelcomeMessage 
        userName="User" 
        showWaveEmoji 
        className="mb-8"
      />
      
      {/* Status Cards Grid - responsive layout */}
      <StatusGrid 
        cards={statusCards} 
        onCardClick={handleCardClick}
      />
      
      {/* Optional: Future dashboard sections can be added here */}
    </div>
  );
}
