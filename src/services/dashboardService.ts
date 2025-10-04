/**
 * Dashboard Service
 * Fetches real-time statistics and metrics for the dashboard
 */

const API_BASE_URL = 'http://localhost:3001';

export interface DashboardStats {
  library: {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    recentActivity: number;
  };
  agents: {
    active: number;
    total: number;
    lastActive?: Date;
  };
  connections: {
    connected: number;
    total: number;
    status: 'healthy' | 'warning' | 'error';
  };
  system: {
    status: 'operational' | 'degraded' | 'down';
    uptime: number;
    version: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string | Date;
}

/**
 * Fetch dashboard statistics from backend
 * GET /api/dashboard/stats
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
    
    if (!response.ok) {
      // If endpoint doesn't exist yet, return mock data
      if (response.status === 404) {
        console.warn('Dashboard stats endpoint not implemented, using fallback data');
        return getFallbackDashboardStats();
      }
      throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
    }
    
    const result: ApiResponse<DashboardStats> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch dashboard statistics');
    }
    
    return result.data;
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    // Return fallback data on error to prevent UI breakage
    return getFallbackDashboardStats();
  }
}

/**
 * Fallback dashboard statistics
 * Used when backend endpoint is not available
 */
function getFallbackDashboardStats(): DashboardStats {
  return {
    library: {
      totalFiles: 0,
      totalFolders: 0,
      totalSize: 0,
      recentActivity: 0,
    },
    agents: {
      active: 0,
      total: 3,
    },
    connections: {
      connected: 0,
      total: 3,
      status: 'warning',
    },
    system: {
      status: 'operational',
      uptime: 0,
      version: '1.0.0',
    },
  };
}

/**
 * Fetch library statistics
 * Uses dedicated stats endpoint for accurate counts
 */
export async function fetchLibraryStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files/stats`);
    
    if (!response.ok) {
      return { totalFiles: 0, totalFolders: 0, totalSize: 0 };
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return { totalFiles: 0, totalFolders: 0, totalSize: 0 };
    }
    
    return {
      totalFiles: result.data.totalFiles || 0,
      totalFolders: result.data.totalFolders || 0,
      totalSize: result.data.totalSize || 0,
    };
  } catch (error) {
    console.error('Library stats fetch error:', error);
    return { totalFiles: 0, totalFolders: 0, totalSize: 0 };
  }
}

/**
 * Fetch connection status
 * Uses existing storage API
 */
export async function fetchConnectionStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/storage/status`);
    
    if (!response.ok) {
      return { connected: 0, total: 3, status: 'warning' as const };
    }
    
    const result: ApiResponse<{ configured: boolean; provider?: string }> = await response.json();
    
    const connected = result.data?.configured ? 1 : 0;
    const status = result.data?.configured ? 'healthy' : 'warning';
    
    return {
      connected,
      total: 3,
      status: status as 'healthy' | 'warning' | 'error',
    };
  } catch (error) {
    console.error('Connection status fetch error:', error);
    return { connected: 0, total: 3, status: 'error' as const };
  }
}
