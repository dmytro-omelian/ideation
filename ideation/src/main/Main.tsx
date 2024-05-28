import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./main.css";

export default function Main() {
  const navigate = useNavigate();

  const handleStartButton = () => {
    navigate("/lab");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      <div className="text-center p-5">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to the Style Transfer Lab!
        </h1>
        <p className="text-xl mb-5">
          Experience the magic of digital art transformation with our advanced
          style transferring technology. Segment and transform any object in
          your images into stunning artworks.
        </p>
        <Button type="default" size="large" onClick={handleStartButton}>
          Start Creating
        </Button>
      </div>
      <div className="mt-10">
        <img
          src="/result_example.png"
          alt="Example of style transferred image"
          className="rounded-lg shadow-xl"
        />
        <p className="mt-2 text-sm italic">
          Sample of a style transferred image using our platform.
        </p>
      </div>
    </div>
  );
}
