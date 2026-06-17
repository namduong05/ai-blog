import { Navigate, Outlet } from "react-router";
import authStore from "../store/authStore";

const ProtectedRoutes = () => {
  const user = authStore((state) => state.user);
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
