import { Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RouteLoadingFallback } from '@/components/layout/RouteLoadingFallback';
import {
  HomePage,
  LibraryPage,
  AgentsPage,
  ConnectionsPage,
  StatusPage,
  SettingsPage,
} from '@/pages';

/**
 * Route definitions with lazy loading for performance optimization
 * Phase 3: Code splitting implemented for all routes except HomePage
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />, // Eager-loaded landing page
      },
      {
        path: 'library',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'library/folders/:folderId',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <LibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'agents',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <AgentsPage />
          </Suspense>
        ),
      },
      {
        path: 'connections',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <ConnectionsPage />
          </Suspense>
        ),
      },
      {
        path: 'status',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <StatusPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <SettingsPage />
          </Suspense>
        ),
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