/**
 * Navigation Configuration
 * Centralized navigation structure for the application
 */

import {
  Home,
  Library,
  Bot,
  Link as LinkIcon,
  Activity,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  groups: NavigationGroup[];
}

/**
 * Main navigation configuration
 * This can be extended to support dynamic navigation from backend
 */
export const navigationConfig: NavigationConfig = {
  groups: [
    {
      title: 'Research Space',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: Home,
          description: 'Dashboard and overview',
        },
        {
          title: 'Library',
          url: '/library',
          icon: Library,
          description: 'Document management',
        },
        {
          title: 'Agents',
          url: '/agents',
          icon: Bot,
          description: 'AI assistants',
        },
        {
          title: 'Connections',
          url: '/connections',
          icon: LinkIcon,
          description: 'Storage configuration',
        },
        {
          title: 'Status',
          url: '/status',
          icon: Activity,
          description: 'System health',
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
          description: 'Application settings',
        },
      ],
    },
  ],
};

/**
 * Get navigation items for a specific group
 */
export function getNavigationItems(groupTitle?: string): NavigationItem[] {
  if (!groupTitle) {
    return navigationConfig.groups.flatMap((group) => group.items);
  }
  
  const group = navigationConfig.groups.find((g) => g.title === groupTitle);
  return group?.items || [];
}

/**
 * Get navigation item by URL
 */
export function getNavigationItemByUrl(url: string): NavigationItem | undefined {
  return navigationConfig.groups
    .flatMap((group) => group.items)
    .find((item) => item.url === url);
}

/**
 * Get navigation item by title
 */
export function getNavigationItemByTitle(title: string): NavigationItem | undefined {
  return navigationConfig.groups
    .flatMap((group) => group.items)
    .find((item) => item.title === title);
}
