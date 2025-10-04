import { useMemo } from 'react';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import { StatusGrid } from '@/components/home/StatusGrid';
import { useNavigateToPage } from '@/hooks/useNavigateToPage';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import type { StatusCard } from '@/types/statusCards';

/**
 * HomePage component - Dashboard with welcome message and status cards
 * Features:
 * - Welcome message with user greeting and wave emoji
 * - Dynamic status cards fetched from backend API
 * - Real-time data updates with loading and error states
 * - Clickable navigation to respective pages
 * - Responsive layout and accessibility compliance
 * - Performance optimized with useMemo
 */
export function HomePage() {
  const navigateToPage = useNavigateToPage();
  const { stats, isLoading } = useDashboardStats();

  // Transform API data into status cards format
  const statusCards: StatusCard[] = useMemo(() => {
    if (!stats) {
      // Return skeleton cards during loading
      return [
        {
          id: 'library',
          type: 'library',
          title: 'Library',
          value: isLoading ? '...' : 0,
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
          value: isLoading ? '...' : 0,
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
          value: isLoading ? '...' : '0/3',
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
          value: isLoading ? '...' : 'Unknown',
          description: 'System health check',
          icon: '⚡',
          navigateTo: '/status',
          status: 'operational',
          color: 'green'
        }
      ];
    }

    return [
      {
        id: 'library',
        type: 'library',
        title: 'Library',
        value: stats.library.totalFiles + stats.library.totalFolders,
        description: `${stats.library.totalFiles} files, ${stats.library.totalFolders} folders`,
        icon: '📚',
        navigateTo: '/library',
        status: 'operational',
        color: 'blue'
      },
      {
        id: 'agents',
        type: 'agents',
        title: 'Agents',
        value: stats.agents.active,
        description: `${stats.agents.active} of ${stats.agents.total} active`,
        icon: '🤖',
        navigateTo: '/agents',
        status: stats.agents.active > 0 ? 'operational' : 'warning',
        color: stats.agents.active > 0 ? 'green' : 'yellow'
      },
      {
        id: 'connections',
        type: 'connections',
        title: 'Connections',
        value: `${stats.connections.connected}/${stats.connections.total}`,
        description: 'Cloud services connected',
        icon: '🔗',
        navigateTo: '/connections',
        status: stats.connections.status === 'healthy' ? 'operational' : 'warning',
        color: stats.connections.status === 'healthy' ? 'green' : 'yellow'
      },
      {
        id: 'status',
        type: 'status',
        title: 'Status',
        value: stats.system.status === 'operational' ? 'Operational' : 'Degraded',
        description: 'System health check',
        icon: '⚡',
        navigateTo: '/status',
        status: stats.system.status === 'operational' ? 'operational' : 'warning',
        color: stats.system.status === 'operational' ? 'green' : 'yellow'
      }
    ];
  }, [stats, isLoading]);

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
