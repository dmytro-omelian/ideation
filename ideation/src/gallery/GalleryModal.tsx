import React, { useState } from "react";
import { Modal, Button, Input, Tag } from "antd";

import Photo from "./Photo.component";

interface GalleryModalProps {
  selectedPhotos: string[];
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
  const [memories, setMemories] = useState<string[]>(
    Array(selectedPhotos.length).fill("")
  );

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

  const handleMemoriesChange = (index: number, value: string) => {
    const updatedMemories = [...memories];
    updatedMemories[index] = value;
    setMemories(updatedMemories);
  };

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
        <div className="mb-4">
          <Button disabled={currentPhotoIndex === 0} onClick={handlePrevPhoto}>
            Previous
          </Button>
          {/* <Photo
            key={currentPhotoIndex}
            photo={selectedPhotos[currentPhotoIndex]}
          /> */}
          <div className="flex flex-col">
            <span>Some random text with my own subtitle</span>
            <div className="mt-2">
              {["tag 1", "tag 2"].map((tag, tagIndex) => (
                <Tag key={tagIndex}>{tag}</Tag>
              ))}
            </div>
          </div>{" "}
          <Button
            disabled={currentPhotoIndex === selectedPhotos.length - 1}
            onClick={handleNextPhoto}
          >
            Next
          </Button>
        </div>
        <Input.TextArea
          value={memories[currentPhotoIndex]}
          onChange={(e) =>
            handleMemoriesChange(currentPhotoIndex, e.target.value)
          }
          placeholder="Memories about this place..."
          autoSize={{ minRows: 3, maxRows: 5 }}
          className="mb-4"
        />
        {/* <div>
          {selectedPhotos[currentPhotoIndex].tags.map(
            (tag: string, tagIndex: number) => (
              <Tag key={tagIndex}>{tag}</Tag>
            )
          )}
        </div> */}
      </div>
    </Modal>
  );
}
