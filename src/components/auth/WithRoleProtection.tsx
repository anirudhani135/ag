
import { Outlet } from "react-router-dom";

export const WithRoleProtection = () => {
  // During development, we're bypassing all role protection
  // All users can access all routes without authentication
  return <Outlet />;
};
