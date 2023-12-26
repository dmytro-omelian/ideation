import React, { useState } from "react";
import "./image-processor.css"; // Ensure this CSS file exists and contains the necessary styles

const ImageProcessor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  // Placeholder function for processing the image
  const processImage = () => {
    console.log("Processing image...");
    // Implement image processing logic here
  };

  const handleOnClickDelete = () => {
    console.log("Deleting image...");
    setUploadedImage(null);
  };

  return (
    <div className="image-processor-container">
      <h2 className="image-processor-title">Image Processor</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-uploader-input"
        multiple
        style={{ display: "none" }}
        id="image-processor-input"
      />
      {!uploadedImage && (
        <button
          onClick={() =>
            document.getElementById("image-processor-input")?.click()
          }
          className="image-uploader-button"
        >
          <span className="plus-icon">+</span>{" "}
        </button>
      )}

      {uploadedImage && (
        <div className="image-display-container">
          <img src={uploadedImage} alt="Upload" className="image-display" />
        </div>
      )}
      <div className="image-processor-controls">
        <button className="control-button">
          <span role="img" aria-label="Edit">
            📝
          </span>
        </button>
        <button className="control-button">
          <span role="img" aria-label="Save">
            💾
          </span>
        </button>
        <button className="control-button" onClick={handleOnClickDelete}>
          <span role="img" aria-label="Delete">
            🗑️
          </span>
        </button>
      </div>
      <button className="image-processor-button" onClick={processImage}>
        Process Image
      </button>
    </div>
  );
};

export default ImageProcessor;
