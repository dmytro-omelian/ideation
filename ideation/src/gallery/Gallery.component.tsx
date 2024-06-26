import React, { useEffect, useState } from "react";
import { DatePicker, Button, Input, message, Tag, Modal, Spin } from "antd";
import axios from "axios";
import Photo from "./Photo.component";
import GalleryModal from "./GalleryModal";
import ImageUploaderModal, { ImageSaveDto } from "./ImageUploaderModal";
import Spinner from "../common/Spinner";
import { useAuth } from "../auth/authContext";
import { getBackendUrl } from "../common/get-backend-url";

const { RangePicker } = DatePicker;

export interface PhotoI {
  id: number;
  imageS3Id: string;
  caption: string;
  tags: string;
  date: Date;
  location: string;
  imageData: { type: string; data: Buffer };
}

export default function Gallery() {
  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoI[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [photosByDate, setPhotosByDate] = useState<PhotoI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const serverUrl = getBackendUrl();

  const uploadFile = async (file: File) => {
    return new Promise<{ filename: string; buffer: ArrayBuffer }>(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          const filename = file.name;
          resolve({ filename, buffer });
        };

        reader.onerror = (error) => {
          reject(new Error("Failed to read file: " + error));
        };
      }
    );
  };

  const handleImageSave = async (imageSaveDto: ImageSaveDto) => {
    console.log(imageSaveDto);
    try {
      setIsLoading(true);

      const { filename, buffer } = await uploadFile(imageSaveDto.image);

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([buffer], { type: imageSaveDto.image.type }),
        filename
      );
      formData.append("caption", imageSaveDto.caption);

      const responseData = await axios.post(`${serverUrl}/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhotosByDate([...photosByDate, responseData.data]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const fetchPhotosForLastMonth = async () => {
      try {
        setIsLoading(true);
        const responseData = await axios.get(`${serverUrl}/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPhotosByDate(responseData.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotosForLastMonth();

    message.success("Account information updated successfully!");
  }, []);

  const handlePhotoClick = (photos: PhotoI[]) => {
    setSelectedPhotos(photos);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isLoading || photosByDate.length <= 0) {
    return <Spinner />;
  }

  const groupedPhotos: { [key: string]: PhotoI[] } = photosByDate.reduce(
    (acc, photo) => {
      const dateKey = photo.date.toString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(photo);
      return acc;
    },
    {} as any
  );

  const sortedDates = Object.keys(groupedPhotos).sort();

  return (
    <div className="p-4">
      <div className="flex flex-col mb-4 w-[33%]">
        <div className="mb-2">
          <Input.Search
            placeholder="Search by tag or text"
            allowClear
            enterButton="Search"
            style={{ width: "100%" }}
          />
        </div>
        <div className="mb-2">
          <Button type="default" onClick={() => setIsVisible(true)}>
            Upload image
          </Button>
        </div>
      </div>

      <ImageUploaderModal
        handleCancel={() => setIsVisible(false)}
        isVisible={isVisible}
        handleImageSave={handleImageSave}
      />

      <div className="flex flex-col lg:grid-cols-3 gap-4">
        {sortedDates.map((date) => (
          <div key={date} className="border p-2">
            <h2 className="text-lg mb-2">{date}</h2>
            <Button
              type="primary"
              onClick={() => handlePhotoClick(groupedPhotos[date])}
            >
              View photos
            </Button>
            <div className="grid grid-cols-2 gap-2 justify-center items-center">
              {groupedPhotos[date].map((photo, index) => {
                const tags = photo?.tags?.split(",");

                console.log("here", tags);

                return (
                  <div
                    key={index}
                    className="flex flex-row justify-center items-center cursor-pointer"
                  >
                    <Photo key={photo.id} photo={photo.imageS3Id} />
                    <div className="flex flex-col">
                      <span>{photo.caption}</span>
                      <div className="mt-2">
                        {tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex}>{tag.trim()}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <GalleryModal
        selectedPhotos={selectedPhotos}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
    </div>
  );
}
