import { useNavigate } from "react-router-dom";
import "./main.css";
import { Button } from "antd";

const Main = () => {
  const navigate = useNavigate();

  const handleStartButton = () => {
    navigate("/lab");
  };

  return (
    <div>
      <div className="main-board">
        <div>Hi Everyone! </div>
        <div>Nice images</div>
      </div>
      <div className="landing-page">
        <Button onClick={handleStartButton}>Start</Button>
      </div>
    </div>
  );
};

export default Main;
