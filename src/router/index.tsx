import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { LibraryPage } from '@/pages/LibraryPage';
import { AgentsPage } from '@/pages/AgentsPage';
import { ConnectionsPage } from '@/pages/ConnectionsPage';
import { StatusPage } from '@/pages/StatusPage';
import { SettingsPage } from '@/pages/SettingsPage';

// Route definitions with proper type safety
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'agents',
        element: <AgentsPage />,
      },
      {
        path: 'connections',
        element: <ConnectionsPage />,
      },
      {
        path: 'status',
        element: <StatusPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
];

// Router instance
export const router = createBrowserRouter(routes);

// Route metadata for navigation
export const routeConfig = [
  { path: '/', title: 'Home', icon: 'Home' },
  { path: '/library', title: 'Library', icon: 'Library' },
  { path: '/agents', title: 'Agents', icon: 'Bot' },
  { path: '/connections', title: 'Connections', icon: 'Link' },
  { path: '/status', title: 'Status', icon: 'Activity' },
  { path: '/settings', title: 'Settings', icon: 'Settings' },
] as const;

export type RoutePath = typeof routeConfig[number]['path'];
export type RouteTitle = typeof routeConfig[number]['title'];