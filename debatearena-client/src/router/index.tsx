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
      // Other protected routes will go here
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
