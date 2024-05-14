import React, { useState } from "react";
import { Modal, Button, Input, Tag } from "antd";

import Photo from "./Photo.component";
import { PhotoI } from "./Gallery.component";
import MemoryView from "./memories/MemoryView";

interface GalleryModalProps {
  selectedPhotos: PhotoI[];
  isModalVisible: boolean;
  handleCancel: () => void;
}

// TODO lets open image that was clicked (in modal, let's manipulate somehow by index and id)
// TODO add button to load memories and and write new (scrolling with bullet points or something like that)
// TODO think about use cases and something like that (I can tell cool story about that)
// TODO add to collections (but dont remove or something like that, help to display nice menu)

export default function GalleryModal({
  selectedPhotos,
  isModalVisible,
  handleCancel,
}: GalleryModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMemoriesOpened, setIsMemoryOpened] = useState(false);

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

  function handleOnMemoryClicked() {
    setIsMemoryOpened(!isMemoriesOpened);
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
      ]}
    >
      <div className="flex flex-col items-center">
        {isMemoriesOpened ? (
          <MemoryView
            userId={1}
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
                {selectedPhotos[currentPhotoIndex]?.tags.map(
                  (tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  )
                )}
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
