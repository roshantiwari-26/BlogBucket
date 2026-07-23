import { AuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  if (user) {
    return <Outlet />;
  } else if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
