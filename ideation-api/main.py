from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import torch
import cv2
import supervision as sv
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor

# Model Initialization
def initialize_model():
    HOME = os.getcwd()
    CHECKPOINT_PATH = os.path.join(HOME, "weights", "sam_vit_b_01ec64.pth")
    DEVICE = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    MODEL_TYPE = "vit_b"

    sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(device=DEVICE)
    mask_generator = SamAutomaticMaskGenerator(sam)
    print('Model Initialized Successfully')
    return mask_generator

# Service for Model Processing
def process_image_with_model(image_path, mask_generator):
    image_bgr = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    sam_result = mask_generator.generate(image_rgb)
    mask_annotator = sv.MaskAnnotator(color_lookup=sv.ColorLookup.INDEX)
    detections = sv.Detections.from_sam(sam_result=sam_result)

    annotated_image = mask_annotator.annotate(scene=image_bgr.copy(), detections=detections)
    output_path = os.path.join(os.getcwd(), "data", "annotated_image.jpeg")
    cv2.imwrite(output_path, annotated_image)
    return output_path

app = FastAPI()
mask_generator = initialize_model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # segmented_image_path = process_image_with_model(file.filename, mask_generator)
    # return FileResponse(segmented_image_path)
    return FileResponse(file.filename)