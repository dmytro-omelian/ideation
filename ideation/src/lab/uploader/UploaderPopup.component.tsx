import { Modal, Select, message, Input, Button, Spin, Checkbox } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import { UploaderModalSubmit } from "../Lab.component";
import Photo from "../../gallery/Photo.component";
import { getBackendUrl } from "../../common/get-backend-url";

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
  const [images, setImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendedImages, setRecommendedImages] = useState<string[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    string[]
  >([]);

  function handleChange(value: string) {
    setSelectedStyle(value);
  }

  function handleOnRemoveClick(fileToRemove: File) {
    setImages(images.filter((image) => image !== fileToRemove));
  }

  async function handleOnSuggestClick() {
    if (prompt.trim() === "") {
      message.error("Please enter a prompt.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/recommend?prompt=${prompt}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendedImages(data.recommended_images);
      message.success("Recommendations fetched successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRequest(request: { file: any }) {
    const file = request.file;
    if (file) {
      setImages([...images, file]);
      message.success(`${file?.name} file uploaded successfully.`);
    } else {
      message.error(`file upload failed.`);
    }
  }

  function handleRecommendationChange(image: string, checked: boolean) {
    if (checked) {
      setSelectedRecommendations([...selectedRecommendations, image]);
    } else {
      setSelectedRecommendations(
        selectedRecommendations.filter((item) => item !== image)
      );
    }
  }

  async function downloadImage(url: string): Promise<File> {
    const response = await fetch(`${getBackendUrl()}/test?key=${url}`);
    const blob = await response.blob();
    const filename = url.split("/").pop() || "recommended_image";
    return new File([blob], filename, { type: blob.type });
  }

  async function handleOnOkClick() {
    const recommendationFiles = await Promise.all(
      selectedRecommendations.map((url) => downloadImage(url))
    );

    const combinedImages = [...images, ...recommendationFiles];

    const uploadSubmitObj = {
      uploadedImage: combinedImages,
      style: selectedStyle,
    } as UploaderModalSubmit;

    handleOnModelSubmit(uploadSubmitObj);
  }

  return (
    <>
      <Modal
        title="Upload the image"
        maskClosable={false}
        open={isImageUploaderEnabled}
        onOk={handleOnOkClick}
        onCancel={handleImageUploaderOnClick}
        footer={[
          <Button key="back" onClick={handleImageUploaderOnClick}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOnOkClick}
          >
            Submit
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Select
            className="w-full"
            defaultValue="style"
            onChange={handleChange}
          >
            <Option value="style">Style Image</Option>
          </Select>
        </div>
        {selectedStyle === "style" && (
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Enter a prompt for recommendations"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleOnSuggestClick}
              className="mt-4"
              type="default"
            >
              Suggest
            </Button>
          </div>
        )}
        <div className="w-full mb-[16px]">
          <div className="image-preview-container">
            {images.map((image, index) => (
              <div key={index} className="slideshow-container">
                <div className="image-preview-container">
                  <button
                    onClick={() => handleOnRemoveClick(image)}
                    className="remove-image-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Dragger
            name="file"
            className="w-full"
            accept="image/*"
            multiple
            showUploadList={true}
            customRequest={handleRequest}
          >
            <p className="text-center text-gray-500">
              Drop images here or click to upload
            </p>
            <p className="text-center text-gray-500">
              (Only image files are supported)
            </p>
          </Dragger>
        </div>
        {loading && <Spin />}
        {recommendedImages.length > 0 && (
          <div className="recommended-images">
            <h3>Recommended Images:</h3>
            <div className="image-grid">
              {recommendedImages.map((image, index) => (
                <div key={index} className="image-frame">
                  <Checkbox
                    onChange={(e) =>
                      handleRecommendationChange(image, e.target.checked)
                    }
                  >
                    <Photo key={index} photo={image} />
                    <span>{image}</span>
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
