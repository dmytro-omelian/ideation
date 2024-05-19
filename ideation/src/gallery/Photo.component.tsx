import { Image } from "antd";
import { useEffect, useState } from "react";

interface PhotoProps {
  key: number;
  photo: string;
}

export default function Photo({ key, photo }: PhotoProps) {
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <div className="p-10 w-[300px] h-auto">
      <Image src={`http://localhost:4000/test?key=${photo}`} />
    </div>
  );
}
