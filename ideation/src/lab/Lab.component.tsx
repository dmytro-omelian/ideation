import { useState } from "react";
import ImageProcessor from "../image-processor/ImageProcessor";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import UploaderPopup from "./uploader/UploaderPopup.component";
import { Button, message } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../auth/authContext";
import "./lab.css";

export interface UploaderModalSubmit {
  uploadedImage: File[];
  style: string;
}

export default function Lab() {
  const [styleImages, setStyleImages] = useState<File[]>([]);
  const [currentStyleImageIndex, setCurrentStyleImageIndex] =
    useState<number>(0);
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  const [isImageUploaderEnabled, setIsImageUploaderEnabled] = useState(false);
  const { token } = useAuth();

  function handleOnModalSubmit(modalSubmitProps: UploaderModalSubmit) {
    const { uploadedImage, style } = modalSubmitProps;

    if (style === "style") {
      setStyleImages((images) => [...images, ...uploadedImage]);
    }

    message.success("was here");
    handleImageUploaderOnClick();
  }

  function handleImageUploaderOnClick() {
    setIsImageUploaderEnabled(!isImageUploaderEnabled);
  }

  function handleOnRemoveStyleImage(imageIndex: number) {
    setStyleImages(styleImages.filter((_, index) => index !== imageIndex));
  }

  function getStyleImage(): File | null {
    if (currentStyleImageIndex < styleImages.length) {
      return styleImages[currentStyleImageIndex];
    }
    message.error("Please upload style image.");
    return null;
  }

  return (
    <div>
      <div className="buttons-menu m-5 bg-slate-100 p-5 rounded-md">
        <div>
          <Button type="default">
            <DeleteOutlined />
          </Button>
          <Button
            type="primary"
            className="ml-2"
            onClick={handleImageUploaderOnClick}
          >
            <div className="flex flex-row items-center justify-center">
              <UploadOutlined />
              <span className="ml-2">Upload style</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="main-board">
        <ImageUploader
          images={styleImages}
          currentStyleImageIndex={currentStyleImageIndex}
          setCurrentStyleImageIndex={setCurrentStyleImageIndex}
          handleOnRemoveStyleImage={handleOnRemoveStyleImage}
        />
        <ImageProcessor
          image={imageToProcess}
          getStyleImage={getStyleImage}
          token={token}
        />
        {isImageUploaderEnabled && (
          <UploaderPopup
            handleOnModalSubmit={handleOnModalSubmit}
            isImageUploaderEnabled={isImageUploaderEnabled}
            handleImageUploaderOnClick={handleImageUploaderOnClick}
          />
        )}
      </div>
    </div>
  );
}
