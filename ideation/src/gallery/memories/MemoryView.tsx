import { Button, Empty, Input, message } from "antd";
import { useEffect, useState } from "react";
import Spinner from "../../common/Spinner";
import axios from "axios";
import { DeleteOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";

export interface MemoryViewProps {
  userId: number;
  imageId: number;
  handleIsMemoreOpened: () => void;
}

export interface IMemory {
  isFavorite: boolean;
  id: number; // TODO delete memories
  userId: number;
  imageId: number;
  text: string;
}

export default function MemoryView({
  userId,
  imageId,
  handleIsMemoreOpened,
}: MemoryViewProps) {
  const [memory, setMemory] = useState("");
  const [previousMemories, setPreviousMemories] = useState<IMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMemories = async (userId: number, imageId: number) => {
      try {
        setIsLoading(true);
        const responseData = await axios.get(
          `http://localhost:4000/memory?userId=${userId}&imageId=${imageId}`
        );

        console.log(responseData.data);
        setPreviousMemories(responseData.data);
        message.success("Received memories successfully!");
      } catch (error) {
        console.error("Error:", error);
        message.error("Received memories successfully!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories(userId, imageId);
  }, []);

  const handleMemoriesChange = (value: string) => {
    setMemory(value);
  };

  const createMemoryLog = async () => {
    try {
      setIsLoading(true);
      const responseData = await axios.post(`http://localhost:4000/memory`, {
        userId,
        imageId,
        text: memory,
      });

      console.log(responseData.data);
      setPreviousMemories([...previousMemories, responseData.data]);
      message.success("Memory was successfully created!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Oops, something went wrong!");
    } finally {
      setIsLoading(false);
      setMemory("");
    }
  };

  const deleteMemoryLog = async (id: number) => {
    try {
      setIsLoading(true);
      const responseData = await axios.delete(
        `http://localhost:4000/memory/${id}`
      );

      console.log(responseData.data);
      setPreviousMemories(
        previousMemories.filter((memory) => memory.id !== id)
      );
      message.success("Memory was successfully removed!");
    } catch (error) {
      console.error("Error:", error);
      message.error("Oops, something went wrong!");
    } finally {
      setIsLoading(false);
      setMemory("");
    }
  };

  const toggleCollectionItem = async (
    id: number,
    isFavorite: boolean,
    collectionId: number
  ) => {
    try {
      setIsLoading(true);
      const responseData = await axios.patch(
        `http://localhost:4000/memory/${id}`,
        { isFavorite: !isFavorite }
      );
      setPreviousMemories(
        previousMemories.map((memory) =>
          memory.id === id ? responseData.data : memory
        )
      );
      message.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!"
      );
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to toggle collection item!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  // TODO add createdAt log for memory

  return (
    <div>
      {previousMemories.length > 0 ? (
        <div>
          {previousMemories.map((memory, index) => {
            function onDelete(id: number): void {
              throw new Error("Function not implemented.");
            }

            return (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <div>{memory.text}</div>
                <div className="flex">
                  {/* Render favorite/unfavorite icon based on favorite status */}
                  {memory.isFavorite ? (
                    <Button
                      type="link"
                      icon={<HeartFilled />}
                      onClick={() =>
                        toggleCollectionItem(memory.id, memory.isFavorite, 1)
                      }
                    />
                  ) : (
                    <Button
                      type="link"
                      icon={<HeartOutlined />}
                      onClick={() =>
                        toggleCollectionItem(memory.id, memory.isFavorite, 1)
                      }
                    />
                  )}

                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteMemoryLog(memory.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty />
      )}

      <Input.TextArea
        value={memory}
        onChange={(e) => handleMemoriesChange(e.target.value)}
        placeholder="Memories about this place..."
        autoSize={{ minRows: 3, maxRows: 5 }}
        className="mb-4"
      />
      <div className="flex flex-row justify-between mt-2">
        <Button
          className="w-[49%]"
          type="default"
          onClick={handleIsMemoreOpened}
        >
          Back
        </Button>
        <Button
          className="w-[49%]"
          disabled={memory.length <= 0}
          type="primary"
          onClick={createMemoryLog}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
