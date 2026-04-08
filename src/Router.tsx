import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';
import {
  LoginPage,
  NotificationsPage,
  PreferencesPage,
  ReadyPage,
  SignupPage,
  TermsPage,
} from './features/session/onboarding-pages';
import { SessionRoot } from './features/session/session-root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SessionRoot />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <Navigate to='/onboard/login' replace />,
          },
          {
            path: 'onboard',
            children: [
              {
                index: true,
                element: <Navigate to='/onboard/login' replace />,
              },
              {
                path: 'login',
                element: <LoginPage />,
              },
              {
                path: 'signup',
                element: <SignupPage />,
              },
              {
                path: 'terms',
                element: <TermsPage />,
              },
              {
                path: 'preferences',
                element: <PreferencesPage />,
              },
              {
                path: 'notifications',
                element: <NotificationsPage />,
              },
              {
                path: 'ready',
                element: <ReadyPage />,
              },
            ],
          },
          {
            path: 'main',
            element: <MainPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
