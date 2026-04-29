import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import ActivityDetailPage from './pages/activity/ActivityDetailPage';
import ActivityPage from './pages/activity/ActivityPage';
import MyActivityDetailPage from './pages/activity/MyActivityDetailPage';
import MyActivityPage from './pages/activity/MyActivityPage';
import NewActivityPage from './pages/activity/NewActivityPage';
import GroupDetailPage from './pages/group/GroupDetailPage';
import GroupPage from './pages/group/GroupPage';
import NewGroupPostPage from './pages/group/NewGroupPostPage';
import MainPage from './pages/MainPage';
import MyPagePage from './pages/mypage/MyPagePage';
import MyPageSettingsPage from './pages/mypage/MyPageSettingsPage';
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
          {
            path: 'group',
            element: <GroupPage />,
          },
          {
            path: 'group/new',
            element: <NewGroupPostPage />,
          },
          {
            path: 'group/:groupId',
            element: <GroupDetailPage />,
          },
          {
            path: 'activity',
            element: <ActivityPage />,
          },
          {
            path: 'activity/my',
            element: <MyActivityPage />,
          },
          {
            path: 'activity/my/:activityId',
            element: <MyActivityDetailPage />,
          },
          {
            path: 'activity/new',
            element: <NewActivityPage />,
          },
          {
            path: 'activity/:activityId',
            element: <ActivityDetailPage />,
          },
          {
            path: 'mypage',
            element: <MyPagePage />,
          },
          {
            path: 'mypage/settings',
            element: <MyPageSettingsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
