/**
 * Route Discovery Utility
 * Discovers and formats all API routes for display on server startup
 */

export interface RouteInfo {
  method: string;
  path: string;
  description: string;
  category: string;
}

/**
 * Get all API routes organized by category
 * @returns Array of route information
 */
export function discoverRoutes(): RouteInfo[] {
  const routes: RouteInfo[] = [
    // Health Check
    {
      method: 'GET',
      path: '/health',
      description: 'Health check endpoint',
      category: 'Health'
    },

    // Storage Configuration Endpoints
    {
      method: 'POST',
      path: '/api/storage/configure',
      description: 'Configure storage provider with credentials',
      category: 'Storage'
    },
    {
      method: 'POST',
      path: '/api/storage/test',
      description: 'Test storage connection',
      category: 'Storage'
    },
    {
      method: 'GET',
      path: '/api/storage/status',
      description: 'Get current storage configuration status',
      category: 'Storage'
    },
    {
      method: 'DELETE',
      path: '/api/storage/lock',
      description: 'Remove configuration lock (admin only)',
      category: 'Storage'
    },

    // File Operations
    {
      method: 'POST',
      path: '/api/files/presigned-url',
      description: 'Get presigned URL for file upload',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/:id/download-url',
      description: 'Get presigned URL for file download',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/:id/preview-url',
      description: 'Get presigned URL for file preview',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/:id/share',
      description: 'Generate shareable link for file',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/:id/duplicate',
      description: 'Duplicate file',
      category: 'Files'
    },
    {
      method: 'PUT',
      path: '/api/files/:id/star',
      description: 'Toggle star/favorite status',
      category: 'Files'
    },
    {
      method: 'GET',
      path: '/api/files/stats',
      description: 'Get library statistics',
      category: 'Files'
    },
    {
      method: 'GET',
      path: '/api/files/list',
      description: 'List all files with pagination',
      category: 'Files'
    },
    {
      method: 'GET',
      path: '/api/files/:id',
      description: 'Get file metadata by ID',
      category: 'Files'
    },
    {
      method: 'PUT',
      path: '/api/files/:id',
      description: 'Update file metadata',
      category: 'Files'
    },
    {
      method: 'DELETE',
      path: '/api/files/:id',
      description: 'Delete file',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/bulk-delete',
      description: 'Delete multiple files',
      category: 'Files'
    },
    {
      method: 'POST',
      path: '/api/files/bulk-move',
      description: 'Move multiple files to folder',
      category: 'Files'
    },

    // Folder Operations
    {
      method: 'POST',
      path: '/api/folders',
      description: 'Create new folder',
      category: 'Folders'
    },
    {
      method: 'GET',
      path: '/api/folders/:id',
      description: 'Get folder with contents',
      category: 'Folders'
    },
    {
      method: 'PUT',
      path: '/api/folders/:id',
      description: 'Rename folder',
      category: 'Folders'
    },
    {
      method: 'DELETE',
      path: '/api/folders/:id',
      description: 'Delete folder and contents',
      category: 'Folders'
    }
  ];

  return routes;
}

/**
 * Format routes for console display
 * @param routes Array of route information
 * @returns Formatted string for console output
 */
export function formatRoutesForConsole(routes: RouteInfo[]): string {
  const categories = ['Health', 'Storage', 'Files', 'Folders'];
  let output = '';

  for (const category of categories) {
    const categoryRoutes = routes.filter(r => r.category === category);
    if (categoryRoutes.length === 0) continue;

    output += `\n  ${category} Endpoints:\n`;
    
    for (const route of categoryRoutes) {
      const method = route.method.padEnd(6);
      const path = route.path.padEnd(35);
      output += `    ${method} ${path} ${route.description}\n`;
    }
  }

  return output;
}

/**
 * Display routes in a formatted table on server startup
 */
export function displayRoutes(): void {
  const routes = discoverRoutes();
  const formattedRoutes = formatRoutesForConsole(routes);
  
  console.log('\n╭────────────────────────────────────────────────────────────────────────────────────╮');
  console.log('│  🚀 Research Space Backend API - Server Started                                   │');
  console.log('├────────────────────────────────────────────────────────────────────────────────────┤');
  console.log(`│  📍 Server URL: http://localhost:${process.env.PORT || 3001}                                              │`);
  console.log(`│  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(11)}                                            │`);
  console.log('│  📊 Total Endpoints: 22                                                            │');
  console.log('├────────────────────────────────────────────────────────────────────────────────────┤');
  console.log('│  📚 API Endpoints:                                                                 │');
  console.log(formattedRoutes);
  console.log('╰────────────────────────────────────────────────────────────────────────────────────╯\n');
}
