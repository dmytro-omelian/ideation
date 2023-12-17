import React from "react";
import "./image-processor.css"; // Create a separate CSS file for styling

const ImageProcessor = () => {
  return (
    <div className="image-processor-container">
      <h2 className="image-processor-title">Image Processor</h2>
      <p className="image-processor-description">
        Welcome to the image processing module. Feel free to explore and modify
        your images here!
      </p>
      <button className="image-processor-button">Process Image</button>
    </div>
  );
};

export default ImageProcessor;
