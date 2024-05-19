import React, { useState, useEffect } from "react";

export interface ImageFrameProps {
  image: File | { url: string };
  onRemove?: () => void;
}

export default function ImageFrame({ image, onRemove }: ImageFrameProps) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setImageSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if ("url" in image) {
      setImageSrc(image.url);
    }
  }, [image]);

  return (
    <div className="relative">
      <span
        className="absolute top-0 right-0 -mt-1 -mr-1 bg-slate-500 p-1 cursor-pointer"
        onClick={onRemove}
      >
        X
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
