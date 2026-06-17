import { Navigate, Outlet } from "react-router";
import authStore from "../store/authStore";

const PublicRoutes = () => {
  const user = authStore((state) => state.user);
  if (user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PublicRoutes;
