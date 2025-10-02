import { useLocation } from 'react-router-dom';
import { MenuItem, SubMenuItem } from 'routes/sitemap';

export const useActiveRoute = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isRouteActive = (path: string): boolean => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const isMenuItemActive = (item: MenuItem): boolean => {
    // Check if it's a direct path match
    if (item.path && item.path !== '#!') {
      return isRouteActive(item.path);
    }

    // Check if any sub-items are active
    if (item.items) {
      return item.items.some(subItem => isRouteActive(subItem.path));
    }

    return false;
  };

  const isSubMenuItemActive = (item: SubMenuItem): boolean => {
    return isRouteActive(item.path);
  };

  return {
    currentPath,
    isRouteActive,
    isMenuItemActive,
    isSubMenuItemActive,
  };
};