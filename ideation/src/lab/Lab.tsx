import ImageProcessor from "../image-processor/ImageProcessor";
import ImageUploader from "../image-uploading-scroll/ImageUploader";
import "./lab.css";

const Lab = () => {
  return (
    <div>
      <div className="buttons-menu">
        <div>
          <button>button 1</button>
          <button>button 2</button>
        </div>
        <div>
          <button>button 3</button>
        </div>
      </div>
      <div className="main-board">
        <ImageUploader />
        <ImageProcessor />
      </div>
      <div className="processing-button">Submit</div>
    </div>
  );
};

export default Lab;
