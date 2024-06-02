import React, { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";

export interface ImageFrameProps {
  image: File;
  onRemove?: () => void;
}

export default function ImageFrame({ image, onRemove }: ImageFrameProps) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image);
    setImageSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <div className="relative">
      <span
        className="absolute top-0 right-0 -mt-1 -mr-1 p-1 cursor-pointer"
        onClick={onRemove}
      >
        <DeleteOutlined />
      </span>
      <div>
        <img
          src={imageSrc}
          alt={image instanceof File ? image.name : "Recommended"}
          className="p-3 image-preview"
        />
      </div>
    </div>
  );
}
