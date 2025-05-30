import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import AdminOTP from './components/AdminOTP';
import Layout from './components/Layout';
import AdminForgotPassword from './components/AdminForgotPassword';

// Placeholder components for dashboards
const UserDashboard: React.FC = () => (
  <div>User Dashboard (Coming Soon)</div>
);

const AdminDashboard: React.FC = () => (
  <div>Admin Dashboard (Coming Soon)</div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <UserLogin /> },
      { path: 'user/dashboard', element: <UserDashboard /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { path: 'admin/forgot-password', element: <AdminForgotPassword /> },
      { path: 'admin/otp', element: <AdminOTP /> },
      { path: 'admin/dashboard', element: <AdminDashboard /> },
    ],
  },
]);

export default router;
