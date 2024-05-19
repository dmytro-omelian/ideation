import React, { useState } from "react";
import "./image-uploader.css";
import ImageFrame from "../ImageFrame.component";
import { Empty } from "antd";

interface ImageUploaderProps {
  images: File[];
  handleOnRemoveStyleImage: (imageId: number) => void;
}

export default function ImageUploader({
  images,
  handleOnRemoveStyleImage,
}: ImageUploaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const renderDots = () => {
    return (
      <div className="dots-container">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentImageIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    );
  };

  const renderImagePreview = () => {
    if (images.length > 0) {
      return (
        <div className="slideshow-container flex flex-col">
          <div className="flex flex-row items-center">
            <button className="slide-arrow left-arrow" onClick={handlePrev}>
              ❮
            </button>
            <div className="image-preview-container">
              <ImageFrame
                image={images[currentImageIndex]}
                onRemove={() => handleOnRemoveStyleImage(currentImageIndex)}
              />
            </div>
            <button className="slide-arrow right-arrow" onClick={handleNext}>
              ❯
            </button>
          </div>
          <div>{renderDots()}</div>
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
