import React, { useState } from "react";
import "./image-uploader.css"; // Ensure this CSS file exists and is styled as required

const ImageUploader = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagesPromises: Promise<string>[] = filesArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImagesPromises).then((newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="image-uploader-container">
      <h2 className="image-uploader-title">Image Uploader</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-uploader-input"
        multiple
        style={{ display: "none" }}
        id="file-input"
      />
      <button
        onClick={() => document.getElementById("file-input")?.click()}
        className="image-uploader-button"
      >
        <span className="plus-icon">+</span>{" "}
      </button>
      <div className="image-preview-container">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img
              src={image}
              alt={`Selected ${index}`}
              className="image-preview"
            />
            <button
              onClick={() => removeImage(index)}
              className="remove-image-button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
