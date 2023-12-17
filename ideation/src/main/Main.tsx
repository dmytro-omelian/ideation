import React from "react";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import ImageProcessor from "../image-processor/ImageProcessor";
import "./main.css";

const Main = () => {
  return (
    <div className="main-board">
      <ImageUploader />
      <ImageProcessor />
    </div>
  );
};

export default Main;
