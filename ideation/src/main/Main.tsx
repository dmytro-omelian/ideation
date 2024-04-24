import { useNavigate } from "react-router-dom";
import "./main.css";

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
        <button className="start-button" onClick={handleStartButton}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Main;
