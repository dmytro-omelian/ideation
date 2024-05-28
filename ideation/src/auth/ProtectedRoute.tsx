import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

export default function ProtectedRoute({ children }: any) {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Save the current location they were trying to go to when they were redirected
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isLoggedIn, loading, navigate, location]);

  if (loading) {
    // Optionally return a loading indicator here while checking auth status
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
