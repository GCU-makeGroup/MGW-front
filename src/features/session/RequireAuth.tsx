import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from './session-context';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useSession();

  if (!state.isAuthenticated) {
    return <Navigate to='/onboard/login' replace />;
  }

  return <>{children}</>;
}
