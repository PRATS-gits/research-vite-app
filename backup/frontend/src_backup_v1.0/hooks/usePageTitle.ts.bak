import { useLocation } from 'react-router-dom';
import { routeConfig } from '@/router';
import { useMemo } from 'react';

export function usePageTitle() {
  const location = useLocation();
  
  const currentRoute = useMemo(() => {
    const match = routeConfig.find((route) => {
      if (route.path === '/library') {
        return location.pathname === '/library' || location.pathname.startsWith('/library/');
      }
      return route.path === location.pathname;
    });

    return match || routeConfig[0];
  }, [location.pathname]);

  const pageTitle = currentRoute.title;
  const pageIcon = currentRoute.icon;
  const pagePath = currentRoute.path;

  return {
    pageTitle,
    pageIcon, 
    pagePath,
    currentRoute,
    pathname: location.pathname
  };
}