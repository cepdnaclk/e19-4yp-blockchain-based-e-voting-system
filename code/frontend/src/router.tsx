import Login from "./components/Login";
import VoterDashboard from "./components/VoterDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/voter", element: <VoterDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
