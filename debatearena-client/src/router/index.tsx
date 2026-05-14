import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import GuestLayout from '../components/layout/GuestLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import GuestRoute from '../components/layout/GuestRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/home/HomePage';
import MyDebatesPage from '../pages/debates/MyDebatesPage';
import LeaderboardPage from '../pages/leaderboard/LeaderboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import NotFoundPage from '../pages/misc/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestRoute><LandingPage /></GuestRoute>,
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <GuestRoute><LoginPage /></GuestRoute>,
      },
      {
        path: '/register',
        element: <GuestRoute><RegisterPage /></GuestRoute>,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/debates',
        element: <MyDebatesPage />,
      },
      {
        path: '/leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/edit',
        element: <EditProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
