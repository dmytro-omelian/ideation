import React from "react";
import "./image-processor.css";
import { Switch } from "@mui/material";

type Point = { x: number; y: number };
type Mode = "points" | "box";

interface IState {
  uploadedImage: string | null;
  mode: Mode;
  points: Point[];
  boxStart: Point | null;
  boxEnd: Point | null;
  tempBoxEnd: Point | null; // Temporary end point for dynamic box drawing
}

class ImageProcessor extends React.Component<{}, IState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      uploadedImage: null,
      mode: "points",
      points: [],
      boxStart: null,
      boxEnd: null,
      tempBoxEnd: null,
    };
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.imageRef = React.createRef<HTMLImageElement>();
  }

  handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      this.state.mode === "box" &&
      this.state.boxStart &&
      !this.state.boxEnd
    ) {
      const rect = this.canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const tempBoxEnd = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        this.setState({ tempBoxEnd }, this.drawTemporaryBox);
      }
    }
  };

  drawTemporaryBox = () => {
    const { boxStart, tempBoxEnd } = this.state;
    if (!boxStart || !tempBoxEnd) return;

    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) {
      this.clearCanvas();
      this.drawAllPoints();
      ctx.beginPath();
      ctx.rect(
        Math.min(boxStart.x, tempBoxEnd.x),
        Math.min(boxStart.y, tempBoxEnd.y),
        Math.abs(tempBoxEnd.x - boxStart.x),
        Math.abs(tempBoxEnd.y - boxStart.y)
      );
      ctx.strokeStyle = "green";
      ctx.stroke();
    }
  };

  clearCanvas = () => {
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  drawAllPoints = () => {
    this.state.points.forEach((point) => this.drawPoint(point));
  };

  handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        this.setState({ uploadedImage: e.target?.result as string });
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  adjustCanvasSize = () => {
    const canvas = this.canvasRef.current;
    const image = this.imageRef.current;
    if (canvas && image) {
      canvas.width = image.width;
      canvas.height = image.height;
    }
  };

  handleClickOnCanvas = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const rect = this.canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { mode, boxStart } = this.state;

      if (mode === "points") {
        this.addPoint({ x, y });
      } else if (mode === "box") {
        if (boxStart) {
          this.setState({ boxEnd: { x, y } }, this.drawBox);
        } else {
          this.setState({ boxStart: { x, y } });
        }
      }
    }
  };

  addPoint = (point: Point) => {
    this.setState(
      (prevState) => ({ points: [...prevState.points, point] }),
      () => this.drawPoint(point)
    );
  };

  drawPoint = (point: Point) => {
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  drawBox = () => {
    const { boxStart, boxEnd } = this.state;
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx && boxStart && boxEnd) {
      ctx.beginPath();
      ctx.rect(
        Math.min(boxStart.x, boxEnd.x),
        Math.min(boxStart.y, boxEnd.y),
        Math.abs(boxEnd.x - boxStart.x),
        Math.abs(boxEnd.y - boxStart.y)
      );
      ctx.strokeStyle = "red";
      ctx.stroke();
      this.setState({ boxStart: null, boxEnd: null });
    }
  };

  toggleMode = () => {
    this.setState((prevState) => ({
      mode: prevState.mode === "points" ? "box" : "points",
    }));
  };

  processImage = () => {
    const imageInput = document.getElementById(
      "image-processor-input"
    ) as HTMLInputElement;

    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      const file = imageInput.files[0];
      console.log("Processing image:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      fetch("http://localhost:8000/uploadfile", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (
            response.ok &&
            response.headers.get("Content-Type")?.includes("image")
          ) {
            return response.blob();
          }
          throw new Error("The response is not an image file.");
        })
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          this.setState({ uploadedImage: imageUrl });
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.log("No file selected.");
    }
  };

  handleOnClickDelete = () => {
    console.log("Deleting image...");
    this.setState({ uploadedImage: null });
  };

  handleOnClickUndo = () => {
    this.setState(
      (prevState) => ({
        points: prevState.points.slice(0, -1),
      }),
      this.redrawCanvas
    );
  };

  redrawCanvas = () => {
    const { points } = this.state;
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas
      points.forEach((point) => this.drawPoint(point)); // Redraw all points
    }
  };

  render() {
    const { uploadedImage, mode } = this.state;

    return (
      <div className="image-processor-container">
        <h2 className="image-processor-title">Image Processor</h2>
        <input
          type="file"
          accept="image/*"
          onChange={this.handleImageChange}
          className="image-uploader-input"
          multiple
          style={{ display: "none" }}
          id="image-processor-input"
        />
        {!uploadedImage && (
          <button
            onClick={() =>
              document.getElementById("image-processor-input")?.click()
            }
            className="image-uploader-button"
          >
            <span className="plus-icon">+</span> Upload Image
          </button>
        )}

        {uploadedImage && (
          <div
            className="image-display-container"
            onMouseMove={this.handleMouseMove}
            style={{ position: "relative" }}
          >
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="image-display"
              ref={this.imageRef}
              onLoad={this.adjustCanvasSize}
            />
            <canvas
              ref={this.canvasRef}
              className="image-canvas"
              onClick={this.handleClickOnCanvas}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
        )}

        <div className="image-processor-controls">
          <button className="control-button" onClick={this.handleOnClickUndo}>
            <span role="img" aria-label="Undo">
              ↩️
            </span>
          </button>
          {/* <button className="control-button" onClick={this.toggleMode}>
            {mode === "points" ? "Switch to Box Mode" : "Switch to Point Mode"}
          </button> */}
          <div>
            <Switch
              onClick={this.toggleMode}
              checked={mode === "points"}
              color="secondary"
            />
            <span>{mode === "points" ? "Draw points" : "Draw box"}</span>
          </div>
          <button className="control-button" onClick={this.processImage}>
            <span role="img" aria-label="Process">
              🔄
            </span>{" "}
            Process Image
          </button>
          <button className="control-button" onClick={this.handleOnClickDelete}>
            <span role="img" aria-label="Delete">
              🗑️
            </span>{" "}
            Delete Image
          </button>
          <button className="control-button">
            <span role="img" aria-label="Save">
              💾
            </span>{" "}
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default ImageProcessor;
