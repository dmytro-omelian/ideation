import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="App-footer">
      <p>© 2024 Ideation. All rights reserved.</p>
      <div className="footer-links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Use</a>
        <a href="#contact">Contact Us</a>
      </div>
      {/* You can also add social media icons here */}
    </footer>
  );
};

export default Footer;
