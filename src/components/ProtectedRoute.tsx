import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// @ts-ignore
export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth.token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
