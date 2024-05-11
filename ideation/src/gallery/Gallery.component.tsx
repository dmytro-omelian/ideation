import React, { useState } from "react";
import { DatePicker, Image, Modal, Button, Tag } from "antd";
import Photo from "./Photo.component";
import GalleryModal from "./GalleryModal";

const { RangePicker } = DatePicker;

const photosByDate = [
  {
    date: "2024-05-01",
    photos: ["./logo.png", "./logo.png", "./logo.png", "./logo.png"],
  },
  {
    date: "2024-04-30",
    photos: ["./logo.png", "./logo.png"],
  },
];

export default function Gallery() {
  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDateChange = (dates: [Date, Date]) => {
    setSelectedDate(dates);
  };

  const handlePhotoClick = (photos: string[]) => {
    setSelectedPhotos(photos);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <RangePicker />
        <Button type="primary">Edit Selected Photos</Button>
      </div>
      <div className="flex flex-col lg:grid-cols-3 gap-4">
        {photosByDate.map((entry) => (
          <div key={entry.date} className="border p-2">
            <h2 className="text-lg mb-2">{entry.date}</h2>
            <Button
              type="primary"
              onClick={() => handlePhotoClick(entry.photos)}
            >
              View photos
            </Button>
            <div className="grid grid-cols-2 gap-2 justify-center items-center">
              {entry.photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-center items-center cursor-pointer"
                >
                  <Photo key={index} photo={photo} />
                  <div className="flex flex-col">
                    <span>Some random text with my own subtitle</span>
                    <div className="mt-2">
                      {["tag 1", "tag 2"].map((tag, tagIndex) => (
                        <Tag key={tagIndex}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <GalleryModal
        selectedPhotos={selectedPhotos}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
      />
      {/* <Modal
        title="Selected Photos"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="">
          {selectedPhotos.map((photo, index) => (
            <div
              key={index}
              className="flex flex-row justify-center items-center cursor-pointer"
            >
              <Photo key={index} photo={photo} />
              <div className="flex flex-col">
                <span>Some random text with my own subtitle</span>
                <div className="mt-2">
                  {["tag 1", "tag 2"].map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal> */}
    </div>
  );
}
