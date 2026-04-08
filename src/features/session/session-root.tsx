import { Outlet } from 'react-router-dom';
import { SessionProvider } from './session-provider';

export function SessionRoot() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
}
