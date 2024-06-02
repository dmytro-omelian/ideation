import React, { useState } from "react";
import {
  DatePicker,
  Input,
  Tag,
  message,
  Button,
  Modal,
  UploadFile,
  Alert,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";

export interface ImageSaveDto {
  selectedDate?: string;
  tags: string[];
  caption: string;
  image: File;
}

interface ImageUploaderModalProps {
  isVisible: boolean;
  handleImageSave: (imageSaveDto: ImageSaveDto) => void;
  handleCancel: () => void;
}

interface UploadProps {
  multiple: boolean;
  fileList: UploadFile[];
  beforeUpload: (file: UploadFile, filesArray: UploadFile[]) => boolean;
  onRemove: (file: UploadFile) => void;
}

export default function ImageUploaderModal({
  isVisible,
  handleImageSave,
  handleCancel,
}: ImageUploaderModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  function handleRequest(request: { file: any }) {
    const file = request.file;
    if (file) {
      setImage(file);
      message.success(`${file?.name} file uploaded successfully.`);
    } else {
      message.error(`file upload failed.`);
    }
  }

  function handleClearFields() {
    setImage(null);
    setSelectedDate(null);
    setTags([]);
    setCaption("");
    handleCancel();
  }

  function handleOnClickSave() {
    const imageSaveDto = {
      selectedDate,
      tags,
      caption,
      image,
    } as ImageSaveDto;

    handleImageSave(imageSaveDto);
  }

  return (
    <Modal
      title="Upload Image"
      open={isVisible}
      onCancel={handleClearFields}
      footer={null}
    >
      <div className="p-4">
        <div className="flex flex-col my-2 mb-4">
          <DatePicker
            style={{ width: "100%", marginBottom: "1rem" }}
            onChange={handleDateChange}
            value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
          />
          <Input
            className="mt-3"
            placeholder="Enter tags (delimited by ,)"
            style={{ width: "100%", marginRight: "1rem" }}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <div className="flex flex-wrap ml-2">
            {tags.map((tag, index) => (
              <Tag key={index} closable onClose={() => handleTagRemove(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <Input
          placeholder="Enter caption"
          style={{ width: "100%", marginBottom: "1rem" }}
          value={caption}
          onChange={handleCaptionChange}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {image ? (
            <div>
              <Alert
                message="Image was successfully uploaded!"
                type="success"
              />
            </div>
          ) : (
            <Dragger
              name="file"
              className="w-full"
              accept="image/*"
              multiple={false}
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
          <div className="flex flex-row my-4">
            <Button
              disabled={!image}
              className="m-1"
              type="primary"
              onClick={handleOnClickSave}
            >
              Upload
            </Button>
            <Button
              disabled={!image}
              className="m-1"
              type="default"
              onClick={handleClearFields}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
