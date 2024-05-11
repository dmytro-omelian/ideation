import { Image } from "antd";

interface PhotoProps {
  key: number;
  photo: string;
}

export default function Photo({ key, photo }: PhotoProps) {
  return (
    <div className="p-10 w-[200px] h-[200px]">
      <Image src={require(`${photo}`)} />
    </div>
  );
}
