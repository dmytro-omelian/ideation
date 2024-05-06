import { useState } from "react";
import ImageProcessor from "../image-processor/ImageProcessor";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import "./lab.css";
import UploaderPopup from "./uploader/UploaderPopup.component";
import { Button } from "antd";

export default function Lab() {
  const [isImageUploaderEnabled, setIsImageUploaderEnabled] = useState(false);

  function handleImageUploaderOnClick() {
    setIsImageUploaderEnabled(!isImageUploaderEnabled);
  }

  return (
    <div>
      <div className="buttons-menu">
        <div>
          <button>button 1</button>

          <Button type="primary" onClick={handleImageUploaderOnClick}>
            Open Popup
          </Button>
        </div>
        <div>
          <button>button 3</button>
        </div>
      </div>
      <div className="main-board">
        <ImageUploader />
        <ImageProcessor />
        {isImageUploaderEnabled && (
          <UploaderPopup
            isImageUploaderEnabled={isImageUploaderEnabled}
            handleImageUploaderOnClick={handleImageUploaderOnClick}
          />
        )}
      </div>
      <div className="processing-button">Submit</div>
    </div>
  );
}
