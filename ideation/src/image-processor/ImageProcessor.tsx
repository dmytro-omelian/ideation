import React, { useState } from "react";
import "./image-processor.css";

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

  const processImage = () => {
    const imageInput = document.getElementById(
      "image-processor-input"
    ) as HTMLInputElement;

    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      console.log("Processing image:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:8000/uploadfile", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (
            response.ok &&
            response.headers.get("Content-Type")?.includes("image")
          ) {
            return response.blob();
          }
          throw new Error("The response is not an image file.");
        })
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setUploadedImage(imageUrl);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.log("No file selected.");
    }
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
