import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import Spinner from "../common/Spinner";

export default function ProtectedRoute({ children }: any) {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isLoggedIn, loading, navigate, location]);

  if (loading) {
    return <Spinner />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
