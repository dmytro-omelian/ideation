import React, { useState } from "react";
import "./image-uploader.css"; // Create a separate CSS file for styling

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-uploader-container">
      <h2 className="image-uploader-title">Image Uploader</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="image-uploader-input"
      />
      {selectedImage && (
        <div className="image-preview-container">
          <img src={selectedImage} alt="Selected" className="image-preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
