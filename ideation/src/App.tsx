import React from "react";
import "./App.css";
import Header from "./header/Header";
import Main from "./main/Main";
import Footer from "./footer/Footer";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Lab from "./lab/Lab";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
