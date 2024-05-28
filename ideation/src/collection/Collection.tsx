import { useState, useEffect } from "react";
import { Table, Space, Button, Spin, message, Popconfirm, Empty } from "antd";
import axios from "axios";
import Spinner from "../common/Spinner";
import { DeleteOutlined } from "@ant-design/icons";
import Photo from "../gallery/Photo.component";
import { PhotoI } from "../gallery/Gallery.component";
import { User } from "../account/Account";
import GalleryModal from "../gallery/GalleryModal";
import { useAuth } from "../auth/authContext";

export interface FavouritesMemory {
  id: number;
  image: PhotoI;
  user: User;
  text: string;
}

export default function Collection() {
  const [memories, setMemories] = useState<FavouritesMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PhotoI | null>(null);
  const { user: authorizedUser, token } = useAuth();

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const responseData = await axios.get(
          `http://localhost:4000/memory/favorites?userId=${authorizedUser?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMemories(responseData.data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const removeFromFavorite = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `http://localhost:4000/memory/${id}`,
        {
          isFavorite: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMemories(memories.filter((memory) => memory.id !== id));
      message.success("Removed from favorites!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to remove from favorites!");
    } finally {
      setIsLoading(false);
    }
  };

  function handleOpenImage(image: PhotoI) {
    setSelectedImage(image);
    setIsVisible(true);
  }

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: PhotoI) => (
        <Button type="primary" onClick={() => handleOpenImage(image)}>
          Open image
        </Button>
      ),
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => removeFromFavorite(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : memories.length > 0 ? (
        <div>
          <GalleryModal
            selectedPhotos={selectedImage ? [selectedImage] : []}
            isModalVisible={isVisible}
            handleCancel={() => setIsVisible(false)}
          />
          <Table
            columns={columns}
            dataSource={memories}
            rowKey="id"
            pagination={false}
          />
        </div>
      ) : (
        <Empty description="No favorites yet" />
      )}
    </div>
  );
}
