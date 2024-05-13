import { useState } from "react";
import ImageProcessor from "../image-processor/ImageProcessor";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import "./lab.css";
import UploaderPopup from "./uploader/UploaderPopup.component";
import { Button, Image, message } from "antd";

export interface UploaderModalSubmit {
  uploadedImage: File;
  style: string;
}

export default function Lab() {
  const [styleImages, setStyleImages] = useState<string[]>([]);
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  const [isImageUploaderEnabled, setIsImageUploaderEnabled] = useState(false);

  function handleOnModalSubmit(modalSubmitProps: UploaderModalSubmit) {
    const { uploadedImage, style } = modalSubmitProps;

    // if (style === "style") {
    //   setStyleImages((images) => [...images, uploadedImage]);
    // } else if (style === "content") {
    //   setImageToProcess(uploadedImage);
    // }

    message.success("was here");
    handleImageUploaderOnClick();
  }

  function handleImageUploaderOnClick() {
    setIsImageUploaderEnabled(!isImageUploaderEnabled);
  }

  return (
    <div>
      <div className="buttons-menu">
        <div>
          <Button>X</Button>

          <Button type="default" onClick={handleImageUploaderOnClick}>
            Open Popup
          </Button>
        </div>
        <div>
          <Button>button 3</Button>
        </div>
      </div>
      <div className="main-board">
        <ImageUploader images={styleImages} />
        <ImageProcessor image={imageToProcess} />
        {isImageUploaderEnabled && (
          <UploaderPopup
            handleOnModalSubmit={handleOnModalSubmit}
            isImageUploaderEnabled={isImageUploaderEnabled}
            handleImageUploaderOnClick={handleImageUploaderOnClick}
          />
        )}
      </div>
      <div className="processing-button">
        <Button type="primary" className="w-[150px] h-10">
          Submit
        </Button>
      </div>
    </div>
  );
}
