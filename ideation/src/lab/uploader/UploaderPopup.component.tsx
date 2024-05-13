import { Modal, Select, message } from "antd";
import { SetStateAction, useState } from "react";

import ImageFrame from "../../ImageFrame.component";
import Dragger from "antd/es/upload/Dragger";
import { UploaderModalSubmit } from "../Lab.component";

const { Option } = Select;

interface UploaderPopupProps {
  handleOnModalSubmit: (props: UploaderModalSubmit) => void;
  isImageUploaderEnabled: boolean;
  handleImageUploaderOnClick: () => void;
}

export default function UploaderPopup(uploaderPopupProps: UploaderPopupProps) {
  const {
    handleOnModalSubmit: handleOnModelSubmit,
    handleImageUploaderOnClick,
    isImageUploaderEnabled,
  } = uploaderPopupProps;
  const [selectedStyle, setSelectedStyle] = useState("style");
  const [image, setImage] = useState<File | null>(null);

  function handleChange(value: SetStateAction<string>) {
    setSelectedStyle(value);
  }

  function handleOnRemoveClick() {
    setImage(null);
  }

  function handleOnOkClick() {
    const uploadSubmitObj = {
      uploadedImage: image,
      style: selectedStyle,
    } as UploaderModalSubmit;

    handleOnModelSubmit(uploadSubmitObj);
  }

  function handleRequest(request: { file: any }) {
    const file = request.file;
    if (file) {
      setImage(file);
      message.success(`${file?.name} file uploaded successfully.`);
    } else {
      message.error(`file upload failed.`);
    }
  }

  return (
    <>
      <Modal
        title="Upload the image"
        maskClosable={false}
        open={isImageUploaderEnabled}
        onOk={handleOnOkClick}
        onCancel={handleImageUploaderOnClick}
      >
        <div style={{ marginBottom: 16 }}>
          <Select
            className="w-full"
            defaultValue="style"
            onChange={handleChange}
          >
            <Option value="style">Style Image</Option>
            <Option value="content">Content Image</Option>
          </Select>
        </div>
        <div className="w-full mb-[16px]">
          <div className="image-preview-container">
            {image && (
              <div className="slideshow-container">
                <div className="image-preview-container">
                  {/* <ImageFrame image={image} /> */}
                  <button
                    onClick={handleOnRemoveClick}
                    className="remove-image-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          {!image && (
            <Dragger
              name="file"
              className="w-full"
              accept="image/*"
              multiple={false}
              showUploadList={true}
              customRequest={handleRequest}
            >
              <p className="text-center text-gray-500">
                Drop an image here or click to upload
              </p>
              <p className="text-center text-gray-500">
                (Only image files are supported)
              </p>
            </Dragger>
          )}
        </div>
      </Modal>
    </>
  );
}
