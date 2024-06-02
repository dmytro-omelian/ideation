import React, { useEffect } from "react";
import "./image-processor.css";
import { CircularProgress } from "@mui/material";
import {
  DeleteOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Checkbox, Button, Empty, Tooltip, message } from "antd";

type Point = { x: number; y: number };

export enum Mode {
  Points = "points",
  Box = "box",
}

interface uploadedImage {
  imageUrl: string;
  width: string;
  height: string;
}

interface IState {
  uploadedImage: string | null;
  uploadedImageHeight?: number;
  uploadedImageWidth?: number;
  mode: Mode;
  points: Point[];
  boxStart: Point | null;
  boxEnd: Point | null;
  tempBoxEnd: Point | null;
  box: Box | null;
  isLoading: boolean;
  isSegmented: boolean;
  error: any;
  originalFile: File | null;
  isBgr: boolean;
}

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

class ImageProcessor extends React.Component<
  {
    image: string | null;
    getStyleImage: () => File | null;
    token: string | null;
  },
  IState
> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;

  constructor(props: {
    image: string | null;
    getStyleImage: () => File | null;
    token: string | null;
  }) {
    super(props);
    this.state = {
      uploadedImage: props.image,
      mode: Mode.Box,
      points: [],
      boxStart: null,
      boxEnd: null,
      tempBoxEnd: null,
      box: null,
      isLoading: false,
      isSegmented: false,
      error: null,
      originalFile: null,
      isBgr: false,
    };
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.imageRef = React.createRef<HTMLImageElement>();
  }

  handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      this.state.mode === Mode.Box &&
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

  componentDidMount() {
    const savedImage = localStorage.getItem("uploadedImage");
    if (savedImage) {
      const img = new Image();
      img.onload = () => {
        this.setState({
          uploadedImageWidth: img.width,
          uploadedImageHeight: img.height,
          uploadedImage: savedImage,
        });
      };
      img.src = savedImage;
    }
  }

  handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      const file = event.target.files[0];
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;

        localStorage.setItem("uploadedImage", imageUrl);

        const img = new Image();
        img.onload = () => {
          console.log("Image width:", img.width, "Image height:", img.height);

          this.setState({
            uploadedImageWidth: img.width,
            uploadedImageHeight: img.height,
          });
        };
        img.src = imageUrl;

        this.setState({ uploadedImage: imageUrl, originalFile: file });
      };
      fileReader.readAsDataURL(file);
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
    if (this.state.isSegmented) return;

    const rect = this.canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { mode, boxStart } = this.state;

      if (mode === Mode.Points) {
        this.addPoint({ x, y });
      } else if (mode === Mode.Box) {
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
      this.setState({
        box: {
          x: Math.min(boxStart.x, boxEnd.x),
          y: Math.min(boxStart.y, boxEnd.y),
          width: Math.abs(boxEnd.x - boxStart.x),
          height: Math.abs(boxEnd.y - boxStart.y),
          label: "",
        },
      });
      console.log(
        JSON.stringify({
          box: {
            x: Math.min(boxStart.x, boxEnd.x),
            y: Math.min(boxStart.y, boxEnd.y),
            width: Math.abs(boxEnd.x - boxStart.x),
            height: Math.abs(boxEnd.y - boxStart.y),
            label: "",
          },
        })
      );
      this.setState({ boxStart: null, boxEnd: null });
    }
  };

  toggleMode = () => {
    const { mode } = this.state;

    this.setState({
      mode: mode === Mode.Points ? Mode.Box : Mode.Points,
    });

    if (this.state.mode === Mode.Points) {
      message.info("Now you can set points to select area to segment.");
    } else {
      message.info("Now you can draw rectangle to segment object.");
    }
  };

  saveImage = (imageUrl: string) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "ideation_results.png";
    a.click();
  };

  saveImageOnClick = () => {
    const { uploadedImage } = this.state;

    if (uploadedImage) {
      this.saveImage(uploadedImage);

      message.success("Image was successfully downloaded!");
    } else {
      message.error("Please upload your image before dowloading it");
    }
  };

  processImage = async () => {
    const { mode, points, box, uploadedImageWidth, uploadedImageHeight } =
      this.state;

    const imageInput = document.getElementById(
      "image-processor-input"
    ) as HTMLInputElement;

    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      this.setState({ isLoading: true });
      const file = imageInput.files[0];
      console.log("Processing image:", file.name);

      const url = `http://localhost:8000/uploadfile/${mode}/segment`;
      const formData = new FormData();
      if (mode === Mode.Box) {
        formData.append("box", JSON.stringify(box));
      } else {
        console.log(JSON.stringify(points));
        formData.append("points", JSON.stringify(points));
      }

      if (uploadedImageHeight && uploadedImageWidth) {
        formData.append("img_width", uploadedImageWidth as unknown as string);
        formData.append("img_height", uploadedImageHeight as unknown as string);
      }
      formData.append("file", file);

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
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
          this.setState({
            uploadedImage: imageUrl,
          });
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          this.setState({ isLoading: false, isSegmented: true });
          message.success("Image was processed successfully!");
        });
    } else {
      message.error("There is no file selected to process.");
    }
  };

  transferStyle = async () => {
    const {
      mode,
      points,
      box,
      uploadedImageWidth,
      uploadedImageHeight,
      isBgr,
      originalFile,
    } = this.state;

    if (box == null) {
      message.error("Please selecte box area");
      return;
    }

    const style_file = this.props.getStyleImage();

    const imageInput = document.getElementById(
      "image-processor-input"
    ) as HTMLInputElement;

    if (
      style_file &&
      imageInput &&
      imageInput.files &&
      imageInput.files.length > 0
    ) {
      this.setState({ isLoading: true });
      const file = imageInput.files[0];
      console.log("Processing image:", file.name);

      const url = `http://localhost:8000/uploadfile/${mode}`;
      const formData = new FormData();
      if (mode === "box") {
        formData.append("box", JSON.stringify(box));
      } else {
        console.log("Points:", JSON.stringify(points));
        formData.append("points", JSON.stringify(points));
      }

      if (uploadedImageHeight && uploadedImageWidth) {
        formData.append("img_width", uploadedImageWidth.toString());
        formData.append("img_height", uploadedImageHeight.toString());
      }
      formData.append("file", file);
      formData.append("style_file", style_file);
      formData.append("isBgr", isBgr ? "true" : "false");

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
        body: formData,
      })
        .then((response) => {
          console.log("Response received:", response);
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
          console.log("Image URL created:", imageUrl);
          this.setState({ uploadedImage: imageUrl });
        })
        .catch((error) => {
          console.error("Error occurred:", error);
          this.setState({ error: error.message });
        })
        .finally(() => {
          this.setState({ isLoading: false, isSegmented: true });
          if (!this.state.error) {
            message.success("Image was processed successfully!");
          } else {
            message.error(`Processing failed: ${this.state.error}`);
          }
        });
    } else {
      message.error("There is no file selected to process.");
    }
  };

  handleOnClickDelete = () => {
    const { uploadedImage } = this.state;

    if (uploadedImage) {
      localStorage.removeItem("uploadedImage");
      this.setState({ uploadedImage: null });
      message.success("Image was successfully deleted!");
    } else {
      message.info("There is no image to delete");
    }
  };

  handleOnClickUndo = () => {
    this.setState(
      (prevState) => ({
        points: prevState.points.slice(0, -1),
      }),
      this.redrawCanvas
    );

    if (this.state.isSegmented) {
      this.setState({
        isSegmented: false,
      });
    }

    message.info("Your last action was removed!");
  };

  redrawCanvas = () => {
    const { points } = this.state;
    const ctx = this.canvasRef.current?.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      points.forEach((point) => this.drawPoint(point));
    }
  };

  handleCheckboxChange = () => {
    this.setState({ isBgr: !this.state.isBgr });
  };

  render() {
    const { uploadedImage, mode, isLoading, isSegmented, isBgr } = this.state;

    return (
      <div className="image-processor-container h-screen">
        <div>
          <div className="image-processor-controls">
            <Button onClick={this.handleOnClickUndo}>
              <div className="flex flex-row items-center justify-center">
                <UndoOutlined />
              </div>
            </Button>
            <Tooltip title={<span>Apply style to background</span>}>
              <Checkbox
                className="flex flex-row items-center justify-center"
                checked={isBgr}
                onChange={this.handleCheckboxChange}
              >
                Background
              </Checkbox>
            </Tooltip>
            <Button type="primary" onClick={this.transferStyle}>
              <div className="flex flex-row items-center justify-center">
                <PlayCircleOutlined />
                <span className="ml-2">Transfer Style</span>
              </div>
            </Button>

            <Button onClick={this.handleOnClickDelete}>
              <div className="flex flex-row items-center justify-center">
                <DeleteOutlined />
                <span className="ml-2">Delete Image</span>
              </div>
            </Button>
            <Button onClick={this.saveImageOnClick}>
              <div className="flex flex-row items-center justify-center">
                <DownloadOutlined />
                <span className="ml-2">Download</span>
              </div>
            </Button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={this.handleImageChange}
            className="image-uploader-input"
            multiple
            style={{ display: "none" }}
            id="image-processor-input"
          />
          {isLoading ? (
            <CircularProgress
              className="flex justify-center items-center h-[350px]"
              color="secondary"
            />
          ) : (
            <div>
              {!uploadedImage ? (
                <div>
                  <div className="flex items-center justify-center h-[350px]">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No image yet"
                    />
                  </div>

                  <Button
                    onClick={() =>
                      document.getElementById("image-processor-input")?.click()
                    }
                  >
                    <div className="flex flex-row items-center justify-center">
                      <UploadOutlined />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div
                  className="flex image-display-container"
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ImageProcessor;
