import React from "react";
import "./App.css";
import Header from "./header/Header";
import Main from "./main/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lab from "./lab/Lab.component";
import Gallery from "./gallery/Gallery.component";
import Account from "./account/Account";
import Collection from "./collection/Collection";
import { AuthProvider } from "./auth/authContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./login/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/lab"
            element={
              <ProtectedRoute>
                <Lab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourite"
            element={
              <ProtectedRoute>
                <Collection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
