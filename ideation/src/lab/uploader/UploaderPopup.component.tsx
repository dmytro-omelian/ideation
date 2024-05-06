import { Modal, Button, Select, message, UploadFile } from "antd";
import { SetStateAction, useState } from "react";
import ImageFrame from "../../ImageFrame.component";
import Dragger from "antd/es/upload/Dragger";

const { Option } = Select;

interface UploaderPopupProps {
  isImageUploaderEnabled: boolean;
  handleImageUploaderOnClick: () => void;
}

interface CustomRequestOptions {
  file: File;
  onError: (error: Error) => void;
  onSuccess: (response: string, file: File) => void;
}

export default function UploaderPopup(uploaderPopupProps: UploaderPopupProps) {
  const { handleImageUploaderOnClick, isImageUploaderEnabled } =
    uploaderPopupProps;
  const [selectedStyle, setSelectedStyle] = useState("style");

  const handleOk = () => {
    handleImageUploaderOnClick();
  };

  const handleCancel = () => {
    handleImageUploaderOnClick();
  };

  const handleChange = (value: SetStateAction<string>) => {
    setSelectedStyle(value);
  };

  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleUpload = (info: { file: { name?: any; status?: any } }) => {
    const { status } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = async ({
    file,
    onError,
    onSuccess,
  }: CustomRequestOptions) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        setImages((prevImages) => [...prevImages, imageBase64]);
        onSuccess("ok", file);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      onError(error);
    }
  };

  const handleRequest = (request: { file: any }) => {
    const file = request.file;
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        setImages((prevImages) => [...prevImages, imageBase64]);
      };
      reader.readAsDataURL(file);

      message.success(`${file?.name} file uploaded successfully.`);
    } else {
      message.error(`file upload failed.`);
    }
  };

  return (
    <>
      <Modal
        title="Upload the image"
        visible={isImageUploaderEnabled}
        onOk={handleOk}
        onCancel={handleCancel}
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
          <span>Upload Image:</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-uploader-input"
            multiple
            style={{ display: "none" }}
            id="file-input"
          />
          {/* <button
        onClick={() => document.getElementById("file-input")?.click()}
        className="image-uploader-button"
      >
        <span className="plus-icon">+</span>{" "}
      </button> */}
          <div className="image-preview-container">
            {images.length > 0 && (
              <div className="slideshow-container">
                <div className="image-preview-container">
                  <ImageFrame image={images[currentImageIndex]} />
                  <button
                    onClick={() => removeImage(currentImageIndex)}
                    className="remove-image-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
          {images.length === 0 && (
            <Dragger
              className="w-full"
              accept="image/*"
              multiple={false}
              showUploadList={false}
              customRequest={handleRequest}
              name="file"
              //   onChange={handleUpload}
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
