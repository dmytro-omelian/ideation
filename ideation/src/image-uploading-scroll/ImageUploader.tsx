import React, { useState } from "react";
import "./image-uploader.css";
import ImageFrame from "../ImageFrame.component";
import { Empty } from "antd";

interface ImageUploaderProps {
  images: File[];
  currentStyleImageIndex: number;
  setCurrentStyleImageIndex: (index: number) => void;
  handleOnRemoveStyleImage: (imageId: number) => void;
}

export default function ImageUploader({
  images,
  currentStyleImageIndex,
  setCurrentStyleImageIndex,
  handleOnRemoveStyleImage,
}: ImageUploaderProps) {
  const handlePrev = () => {
    const updIndex =
      currentStyleImageIndex > 0
        ? currentStyleImageIndex - 1
        : images.length - 1;

    setCurrentStyleImageIndex(updIndex);
  };

  const handleNext = () => {
    const updIndex = (currentStyleImageIndex + 1) % images.length;

    setCurrentStyleImageIndex(updIndex);
  };

  const handleDotClick = (index: number) => {
    setCurrentStyleImageIndex(index);
  };

  const renderDots = () => {
    return (
      <div className="dots-container">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${
              index === currentStyleImageIndex ? "active" : ""
            }`}
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
                image={images[currentStyleImageIndex]}
                onRemove={() =>
                  handleOnRemoveStyleImage(currentStyleImageIndex)
                }
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
