/**
 * Page Component Exports
 * Phase 3: Lazy-loaded for optimal code splitting and performance
 * HomePage is eager-loaded as it's the landing page
 */

import { lazy } from 'react';

// Eager-loaded landing page for instant initial render
export { HomePage } from './HomePage';

// Lazy-loaded routes for code splitting
export const LibraryPage = lazy(() => import('./LibraryPage').then(m => ({ default: m.LibraryPage })));
export const AgentsPage = lazy(() => import('./AgentsPage').then(m => ({ default: m.AgentsPage })));
export const ConnectionsPage = lazy(() => import('./ConnectionsPage').then(m => ({ default: m.ConnectionsPage })));
export const StatusPage = lazy(() => import('./StatusPage').then(m => ({ default: m.StatusPage })));
export const SettingsPage = lazy(() => import('./SettingsPage').then(m => ({ default: m.SettingsPage })));