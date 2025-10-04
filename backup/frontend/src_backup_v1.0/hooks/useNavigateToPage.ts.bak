import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for handling page navigation with performance optimization
 * Provides memoized navigation function to prevent unnecessary re-renders
 */
export function useNavigateToPage() {
  const navigate = useNavigate();

  const navigateToPage = useCallback((path: string) => {
    // Add any future navigation analytics or tracking here
    navigate(path);
  }, [navigate]);

  return navigateToPage;
}