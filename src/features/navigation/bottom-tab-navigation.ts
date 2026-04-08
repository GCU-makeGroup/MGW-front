import type { NavigateFunction } from 'react-router-dom';
import type { BottomTabKey } from '../session/ui';

const primaryTabRoutes: Partial<Record<BottomTabKey, string>> = {
  main: '/main',
  group: '/group',
};

export function navigateFromBottomTab(navigate: NavigateFunction, tab: BottomTabKey) {
  const targetPath = primaryTabRoutes[tab];

  if (!targetPath) {
    return;
  }

  navigate(targetPath);
}
