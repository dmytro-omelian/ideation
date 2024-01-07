from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import torch
import cv2
import supervision as sv
from mobile_sam import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
# def initialize_model():
#     HOME = os.getcwd()
#     check_point_file = "mobile_sam.pt"
#     CHECKPOINT_PATH = os.path.join(HOME, "weights", f"{check_point_file}")
#     device = "cuda" if torch.cuda.is_available() else "cpu"
#     MODEL_TYPE = "vit_t"
#
#     sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(device=device)
#     mask_generator = SamAutomaticMaskGenerator(sam)
#     print('Model Initialized Successfully')
#     return mask_generator

# Service for Model Processing
def process_image_with_model(image_path, default_box):
    HOME = os.getcwd()
    check_point_file = "mobile_sam.pt"
    CHECKPOINT_PATH = os.path.join(HOME, "weights", f"{check_point_file}")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    MODEL_TYPE = "vit_t"

    mobile_sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(device=device)
    # mask_generator = SamAutomaticMaskGenerator(mobile_sam)

    image_bgr = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    predictor = SamPredictor(mobile_sam)
    predictor.set_image(image_rgb)
    print('Predicting')
    masks, _, _ = predictor.predict(
        box=default_box,
        multimask_output=False
    )
    print('Masks Generated')
    box_annotator = sv.BoxAnnotator(color=sv.Color.red())
    mask_annotator = sv.MaskAnnotator(color=sv.Color.red(), color_lookup=sv.ColorLookup.INDEX)

    detections = sv.Detections(
        xyxy=sv.mask_to_xyxy(masks=masks),
        mask=masks
    )
    detections = detections[detections.area == np.max(detections.area)]

    segmented_image = mask_annotator.annotate(scene=image_bgr.copy(), detections=detections)
    output_path = os.path.join(os.getcwd(), "data", "annotated_image.jpeg")
    cv2.imwrite(output_path, segmented_image)
    return output_path

app = FastAPI()
# mask_generator = initialize_model()

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


import numpy as np
@app.post("/uploadfile")
async def create_upload_file(file: UploadFile = File(...)):
    print('File Received. Starting Processing')

    default_box = {'x': 68, 'y': 247, 'width': 555, 'height': 678, 'label': ''}

    # box = widget.bboxes[0] if widget.bboxes else default_box
    box = default_box
    box = np.array([
        box['x'],
        box['y'],
        box['x'] + box['width'],
        box['y'] + box['height']
    ])

    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segmented_image_path = process_image_with_model(file.filename, box)
    return FileResponse(segmented_image_path)
