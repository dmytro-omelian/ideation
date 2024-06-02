import { Image } from "antd";
import { useState } from "react";
import { getBackendUrl } from "../common/get-backend-url";

interface PhotoProps {
  key: number;
  photo: string;
}

export default function Photo({ key, photo }: PhotoProps) {
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <div className="p-10 w-[300px] h-auto">
      <Image src={`${getBackendUrl()}/test?key=${photo}`} />
    </div>
  );
}
