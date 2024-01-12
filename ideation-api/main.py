import json
import shutil
import os
import numpy as np
import torch
import cv2
import supervision as sv

from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from mobile_sam import sam_model_registry, SamPredictor

from entities import Point, Box


def initialize_model():
    HOME = os.getcwd()
    check_point_file = "mobile_sam.pt"
    CHECKPOINT_PATH = os.path.join(HOME, "weights", f"{check_point_file}")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    MODEL_TYPE = "vit_t"

    mobile_sam = sam_model_registry[MODEL_TYPE](checkpoint=CHECKPOINT_PATH).to(device=device)

    predictor = SamPredictor(mobile_sam)
    print('Model Initialized')
    return predictor


def process_image_with_model(image_path, default_box: Box, predictor: SamPredictor):
    image_bgr = cv2.imread(image_path)

    if image_bgr is None:
        print("Error: Image not found or unable to read.")
        return

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    height, width = image_bgr.shape[:2]
    print(f"Image size: Width = {width}, Height = {height}")

    predictor.set_image(image_rgb)
    print('Predicting')

    scale_factor: float = width / 600 # FIXME receive this parameter from frontend

    # TODO load file with default box drawn to check if we get the correct box from the file
    box_coords = np.array([
        default_box['x'] * scale_factor,
        default_box['y'] * scale_factor,
        (default_box['x'] + default_box['width']) * scale_factor,
        (default_box['y'] + default_box['height']) * scale_factor
    ])

    masks, _, _ = predictor.predict(
        box=box_coords,
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

    source_image = box_annotator.annotate(scene=image_bgr.copy(), detections=detections, skip_label=True)
    cv2.imwrite(os.path.join(os.getcwd(), "data", "source_image.jpeg"), source_image)

    segmented_image = mask_annotator.annotate(scene=image_bgr.copy(), detections=detections)
    output_path = os.path.join(os.getcwd(), "data", "annotated_image.jpeg")
    cv2.imwrite(output_path, segmented_image)

    return output_path

app = FastAPI()
sam_predictor = initialize_model()

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
    print('File Received. Starting Processing')

    default_box: Box = {'x': 68, 'y': 247, 'width': 555, 'height': 678, 'label': ''}

    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segmented_image_path = process_image_with_model(file.filename, default_box, sam_predictor)
    return FileResponse(segmented_image_path)

@app.post("/uploadfile/box")
async def create_upload_file(file: UploadFile = File(...), box: str = Form(...)):
    print('File Received. Starting Processing')
    try:
        box: Box = json.loads(box)
        print('Box Received: ', box)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for points")

    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segmented_image_path = process_image_with_model(file.filename, box, sam_predictor)
    return FileResponse(segmented_image_path)

@app.post("/uploadfile/points")
async def create_upload_file(file: UploadFile = File(...), points: str = Form(...)):
    # FIXME this is not working
    print('File Received. Starting Processing')
    try:
        points_list: List[Point] = json.loads(points)
        print('Points Received: ', points_list)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for points")

    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return FileResponse(file.filename)