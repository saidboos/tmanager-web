import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
