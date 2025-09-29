import { useLocation } from 'react-router-dom';
import { routeConfig } from '@/router';
import { useMemo } from 'react';

export function usePageTitle() {
  const location = useLocation();
  
  const currentRoute = useMemo(() => {
    return routeConfig.find(route => route.path === location.pathname) || routeConfig[0];
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