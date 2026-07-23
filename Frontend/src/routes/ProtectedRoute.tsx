import { useAppSelector } from "../app/hooks";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}
function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  if (!allowedRoles.includes(user.role)) {
    return "Access Denied";
  }
  return <Outlet />;
}

export default ProtectedRoute;
