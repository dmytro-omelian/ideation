import { Spin } from "antd";

export default function Spinner() {
  return (
    <div className="h-screen stop-0 left-0 w-full flex justify-center items-center bg-gray-400 bg-opacity-75 z-50">
      <Spin size="large" />
    </div>
  );
}
