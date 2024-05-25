import { useState } from "react";
import ImageProcessor from "../image-processor/ImageProcessor";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import "./lab.css";
import UploaderPopup from "./uploader/UploaderPopup.component";
import { Button, Image, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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

  function handleOnModalSubmit(modalSubmitProps: UploaderModalSubmit) {
    const { uploadedImage, style } = modalSubmitProps;

    if (style === "style") {
      setStyleImages((images) => [...images, ...uploadedImage]);
    } else if (style === "content") {
      // setImageToProcess(uploadedImage);
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
          <Button type="default" className="ml-2">
            <div className="flex flex-row items-center justify-center">
              <EditOutlined />
              <span className="ml-2">Save Draft</span>
            </div>
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
        <ImageProcessor image={imageToProcess} getStyleImage={getStyleImage} />
        {isImageUploaderEnabled && (
          <UploaderPopup
            handleOnModalSubmit={handleOnModalSubmit}
            isImageUploaderEnabled={isImageUploaderEnabled}
            handleImageUploaderOnClick={handleImageUploaderOnClick}
          />
        )}
      </div>
      {/* <div className="processing-button">
        <Button type="primary" className="w-[150px] h-10">
          Submit
        </Button>
      </div> */}
    </div>
  );
}
