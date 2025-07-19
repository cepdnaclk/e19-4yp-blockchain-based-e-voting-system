import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminForgotPassword from "./components/AdminForgotPassword";
import AdminLogin from "./components/AdminLogin";
import AdminOTP from "./components/AdminOTP";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import UserDashboard from "./components/UserDashboard";
import UserLogin from "./components/UserLogin";
import Unauthorized from "./components/Unauthorized";
import ElectionResults from "./components/ElectionResults";
import QRScanPage from "./components/QR/QRScanPage";
import QRScanLoginPage from "./components/QR/QRScanLoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <UserLogin /> },
      { path: "scan", element: <QRScanPage /> },
      { path: "scan-login", element: <QRScanLoginPage /> },
      { path: "user/dashboard", element: <UserDashboard /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/forgot-password", element: <AdminForgotPassword /> },
      { path: "admin/otp", element: <AdminOTP /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "unautharized", element: <Unauthorized /> },
      { path: "results", element: <ElectionResults /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
