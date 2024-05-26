import React from "react";
import "./App.css";
import Header from "./header/Header";
import Main from "./main/Main";
import Footer from "./footer/Footer";
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
          <Route path="/lab" element={<ProtectedRoute component={Lab} />} />
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
            element={<ProtectedRoute component={Account} />}
          />
          <Route
            path="/favourite"
            element={<ProtectedRoute component={Collection} />}
          />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
