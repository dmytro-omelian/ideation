import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { JSX } from "react/jsx-runtime";

export default function ProtectedRoute({ children }: any) {
  const { isLoggedIn } = useAuth();

  console.log("logged in");

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
}
