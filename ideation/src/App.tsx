import React from "react";
import "./App.css";
import Header from "./header/Header";
import Main from "./main/Main";
import Footer from "./footer/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lab from "./lab/Lab.component";
import Gallery from "./gallery/Gallery.component";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
