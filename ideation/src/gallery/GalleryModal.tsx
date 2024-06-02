import React, { useEffect, useState } from "react";
import { Modal, Button, Tag, message } from "antd";
import axios from "axios";

import Photo from "./Photo.component";
import { PhotoI } from "./Gallery.component";
import MemoryView from "./memories/MemoryView";
import { useAuth } from "../auth/authContext";
import Spinner from "../common/Spinner";
import { getBackendUrl } from "../common/get-backend-url";

interface GalleryModalProps {
  selectedPhotos: PhotoI[];
  isModalVisible: boolean;
  handleCancel: () => void;
}

export default function GalleryModal({
  selectedPhotos,
  isModalVisible,
  handleCancel,
}: GalleryModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMemoriesOpened, setIsMemoryOpened] = useState(false);
  const { user: authorizedUser, token } = useAuth();
  const serverUrl = getBackendUrl();

  useEffect(() => {
    if (!authorizedUser) return;

    setIsLoading(false);
  }, [authorizedUser]);

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex + 1) % selectedPhotos.length
    );
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedPhotos.length) % selectedPhotos.length
    );
  };

  const handleOnMemoryClicked = () => {
    setIsMemoryOpened(!isMemoriesOpened);
  };

  const handleSendToTelegram = async () => {
    const photo = selectedPhotos[currentPhotoIndex];
    const formData = new FormData();
    formData.append("caption", photo.caption);
    formData.append("tags", photo.tags);

    try {
      const response = await axios.get(
        `${serverUrl}/test?key=${photo.imageS3Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      formData.append("image", response.data);

      await axios.post(`${serverUrl}/telegram/send-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Image sent to Telegram successfully!");
    } catch (error) {
      console.error("Error sending image to Telegram:", error);
      message.error("Failed to send image to Telegram.");
    }
  };

  if (isLoading || !authorizedUser) {
    return <Spinner />;
  }

  return (
    <Modal
      title="Selected Photos"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Close
        </Button>,
        <Button key="send" type="primary" onClick={handleSendToTelegram}>
          Send to Telegram
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center">
        {isMemoriesOpened ? (
          <MemoryView
            userId={authorizedUser.id}
            imageId={selectedPhotos[currentPhotoIndex].id}
            handleIsMemoreOpened={handleOnMemoryClicked}
          />
        ) : (
          <div className="mb-4">
            <Photo
              key={currentPhotoIndex}
              photo={selectedPhotos[currentPhotoIndex]?.imageS3Id}
            />
            <div className="flex flex-col">
              <span>{selectedPhotos[currentPhotoIndex]?.caption}</span>
              <div className="mt-2">
                {selectedPhotos[currentPhotoIndex]?.tags
                  .split(",")
                  .map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag.trim()}</Tag>
                  ))}
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <Button
                className="w-[49%]"
                disabled={currentPhotoIndex === 0}
                onClick={handlePrevPhoto}
              >
                Previous
              </Button>
              <Button
                className="w-[49%]"
                disabled={currentPhotoIndex === selectedPhotos.length - 1}
                onClick={handleNextPhoto}
              >
                Next
              </Button>
            </div>
            <Button
              type="primary"
              className="w-full mt-2"
              onClick={handleOnMemoryClicked}
            >
              Open Memories
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
