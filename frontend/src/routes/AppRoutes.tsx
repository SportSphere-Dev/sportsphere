import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import CustomerLayout from '@/layouts/CustomerLayout';
import AdminLayout from '@/layouts/AdminLayout';

import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage';
import VenuePage from '@/pages/booking/VenuePage';
import BookingPage from '@/pages/booking/BookingPage';
import PaymentPage from '@/pages/booking/PaymentPage';
import MyBookingsPage from '@/pages/dashboard/MyBookingsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';

const router = createBrowserRouter([
  // Customer Routes (Shared CustomerLayout)
  {
    element: <CustomerLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify', element: <VerifyOtpPage /> },
      { path: '/venue', element: <VenuePage /> },
      { path: '/booking', element: <BookingPage /> },
      { path: '/payment', element: <PaymentPage /> },
      { path: '/my-bookings', element: <MyBookingsPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },

  // Admin Routes (Shared AdminLayout)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
    ],
  },

  // Catch-all 404 Route (Unwrapped / Standalone)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}