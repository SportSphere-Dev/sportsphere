import { createBrowserRouter } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage';
import VenuePage from '@/pages/booking/VenuePage';
import BookingPage from '@/pages/booking/BookingPage';
import PaymentPage from '@/pages/booking/PaymentPage';
import MyBookingsPage from '@/pages/dashboard/MyBookingsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'verify',
        element: <VerifyOtpPage />,
      },
      {
        path: 'venue',
        element: <VenuePage />,
      },
      // Authenticated Customer Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'booking',
            element: <BookingPage />,
          },
          {
            path: 'payment',
            element: <PaymentPage />,
          },
          {
            path: 'my-bookings',
            element: <MyBookingsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  // Admin Route (Requires 'admin' role)
  {
    path: '/admin',
    element: <RoleRoute requiredRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);