/**
 * useDashboardStats Hook
 * Fetches and manages dashboard statistics with loading and error states
 */

import { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchLibraryStats, fetchConnectionStatus, type DashboardStats } from '@/services/dashboardService';

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch dashboard statistics
 * Automatically fetches on mount and provides refetch capability
 */
export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch from multiple sources for comprehensive data
      const [dashboardData, libraryData, connectionData] = await Promise.all([
        fetchDashboardStats(),
        fetchLibraryStats(),
        fetchConnectionStatus(),
      ]);
      
      // Merge data from different sources
      const mergedStats: DashboardStats = {
        ...dashboardData,
        library: {
          ...dashboardData.library,
          totalFiles: libraryData.totalFiles,
          totalFolders: libraryData.totalFolders,
          totalSize: libraryData.totalSize,
        },
        connections: {
          ...dashboardData.connections,
          ...connectionData,
        },
      };
      
      setStats(mergedStats);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch dashboard stats');
      setError(error);
      console.error('Dashboard stats error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Optional: Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchData,
  };
}
