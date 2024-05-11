import { Image } from "antd";

interface PhotoProps {
  key: number;
  photo: string;
}

export default function Photo({ key, photo }: PhotoProps) {
  return (
    <div className="p-10 w-[300px] h-[300px]">
      <Image src={require(`${photo}`)} />
    </div>
  );
}
