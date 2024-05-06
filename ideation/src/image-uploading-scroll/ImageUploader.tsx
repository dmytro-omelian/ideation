import React, { useState } from "react";
import "./image-uploader.css";
import ImageFrame from "../ImageFrame.component";
import { Empty } from "antd";

interface ImageUploaderProps {
  images: string[];
}

export default function ImageUploader({ images }: ImageUploaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const renderImagePreview = () => {
    if (images.length > 0) {
      return (
        <div className="slideshow-container">
          <button className="slide-arrow left-arrow" onClick={handlePrev}>
            ❮
          </button>
          <div className="image-preview-container">
            <ImageFrame image={images[currentImageIndex]} />
          </div>
          <button className="slide-arrow right-arrow" onClick={handleNext}>
            ❯
          </button>
        </div>
      );
    } else {
      return (
        <div className="border-dashed border-black rounded-lg p-8 mx-auto">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No images yet"
          />
        </div>
      );
    }
  };

  return (
    <div className="image-uploader-container">
      <div className="image-preview-container">{renderImagePreview()}</div>
    </div>
  );
}
