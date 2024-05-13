import React, { useState } from "react";
import {
  DatePicker,
  Input,
  Tag,
  Upload,
  message,
  Button,
  Modal,
  UploadFile,
  Alert,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";

export interface ImageSaveDto {
  selectedDate?: string;
  tags: string[];
  caption: string;
  image: File;
}

interface ImageUploaderModalProps {
  isVisible: boolean;
  handleImageSave: (imageSaveDto: ImageSaveDto) => void;
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
}: ImageUploaderModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString);
  };

  const handleTagChange = () => {
    if (tagInput) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const [fileList, setFileList] = useState<any>([]);
  const [mode, setMode] = useState(false);

  const uploadProps: UploadProps = {
    multiple: mode,
    fileList,
    beforeUpload: (file, filesArray) => {
      let count = 0;
      let files = filesArray.filter((file) => {
        const isPNG = file.type === "image/png";
        !isPNG && count++;
        return isPNG;
      });

      if (count > 0) {
        setFileList([]);
        message.error(`${count} Files Not Uploaded. Please Upload PNG File/s`);
        return false;
      }

      if (mode) {
        setFileList(files);
      } else {
        setFileList((prev: any) => {
          let newFiles = [...prev];
          newFiles.push(file);
          console.log(fileList);
          return newFiles;
        });
      }
      console.log(fileList);
      return true;
    },
    onRemove: (file) => {
      setFileList((prev: any[]) => prev.filter((f) => f.uid !== file.uid));
    },
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
  }

  function handleOnClickSave() {
    const imageSaveDto = {
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
          <DatePicker style={{ width: "100%", marginRight: "1rem" }} />
          <Input
            className="mt-3"
            placeholder="Enter tags"
            style={{ width: "100%", marginRight: "1rem" }}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={handleTagChange}
          />
          {/* <Button onClick={handleTagChange}>Enter</Button> */}
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
              {/* <img src={image} /> */}
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
