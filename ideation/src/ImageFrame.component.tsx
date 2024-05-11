import React from "react";
import { useState } from "react";

export interface ImageFrameProps {
  image: string;
  onRemove?: () => void;
}

export default function ImageFrame({ image, onRemove }: ImageFrameProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <span
        className="absolute top-0 right-0 -mt-1 -mr-1 bg-slate-500 p-1 cursor-pointer"
        onClick={onRemove}
      >
        X
      </span>
      <div>
        <img src={image} alt={`Slide 1`} className="p-3 image-preview" />
      </div>
    </div>
  );
}
