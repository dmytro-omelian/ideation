import json
import shutil
import os
import numpy as np
import torch
import cv2
import supervision as sv
import torchvision.transforms as transforms

from PIL import Image, ImageFile
import torch
import clip
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from typing import List, Union
from tqdm import tqdm

from style_transfer import run_style_transfer
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()

from torchvision.models import vgg19, VGG19_Weights

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


def process_image_with_model_and_get_mask(image_path, default_box: Box, predictor: SamPredictor):
    image_bgr = cv2.imread(image_path)

    if image_bgr is None:
        print("Error: Image not found or unable to read.")
        return

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    height, width = image_bgr.shape[:2]
    print(f"Image size: Width = {width}, Height = {height}")

    predictor.set_image(image_rgb)
    print('Predicting')

    scale_factor: float = 1 # FIXME receive this parameter from frontend

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

    mask = detections.mask[0]
    mask = mask.astype(bool)

    return mask

def process_image_with_model_and_get_output_path(image_path, default_box: Box, predictor: SamPredictor):
    image_bgr = cv2.imread(image_path)

    if image_bgr is None:
        print("Error: Image not found or unable to read.")
        return

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    height, width = image_bgr.shape[:2]
    print(f"Image size: Width = {width}, Height = {height}")

    predictor.set_image(image_rgb)
    print('Predicting')

    scale_factor: float = 1 # FIXME receive this parameter from frontend

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


cnn = vgg19(weights=VGG19_Weights.DEFAULT).features.eval()

def transfer_style(mask, content_img_path, style_img_path, isBgr, output_filename="output_image.jpg"):
    cnn_normalization_mean = torch.tensor([0.485, 0.456, 0.406])
    cnn_normalization_std = torch.tensor([0.229, 0.224, 0.225])

    # imsize = 512 # if torch.cuda.is_available() else 128

    imsize = 512

    loader = transforms.Compose([
        transforms.Resize(imsize),
        transforms.ToTensor()
    ])

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    torch.set_default_device(device)

    def image_loader(image_path):
        image = Image.open(image_path)
        image = loader(image).unsqueeze(0)
        return image.to(device, torch.float)

    style_img = image_loader(style_img_path)
    content_img = image_loader(content_img_path)

    # TODO how not to loose image quality for result (not masked image part)

    def crop_to_match(content_img, style_img):
        _, _, h_c, w_c = content_img.size()  # Get dimensions of content image
        _, _, h_s, w_s = style_img.size()  # Get dimensions of style image

        # Calculate cropping box (left, upper, right, lower)
        left = (w_s - w_c) // 2
        top = (h_s - h_c) // 2
        right = left + w_c
        bottom = top + h_c

        # Convert style image to PIL Image to use crop function
        style_img_pil = transforms.ToPILImage()(style_img.squeeze(0))
        style_img_cropped = style_img_pil.crop((left, top, right, bottom))

        # Transform back to tensor
        style_img_cropped = transforms.ToTensor()(style_img_cropped).unsqueeze(0)
        return style_img_cropped

    # Crop style image to match the size of content image
    style_img = crop_to_match(content_img, style_img)

    assert style_img.size() == content_img.size(), \
        "we need to import style and content images of the same size"

    input_img = content_img.clone()

    output = run_style_transfer(cnn, cnn_normalization_mean, cnn_normalization_std,
                                content_img, style_img, input_img)

    output_img = output.clone()

    content_img_np = content_img.squeeze().detach().cpu().numpy().transpose(1, 2, 0)
    styled_img_np = output_img.squeeze().detach().cpu().numpy().transpose(1, 2, 0)

    content_img_np = (content_img_np - content_img_np.min()) / (content_img_np.max() - content_img_np.min()) * 255
    styled_img_np = (styled_img_np - styled_img_np.min()) / (styled_img_np.max() - styled_img_np.min()) * 255

    content_img_np = content_img_np.astype(np.uint8)
    styled_img_np = styled_img_np.astype(np.uint8)

    content_img_resized = cv2.resize(content_img_np, (mask.shape[1], mask.shape[0]), interpolation=cv2.INTER_AREA)
    styled_img_resized = cv2.resize(styled_img_np, (mask.shape[1], mask.shape[0]), interpolation=cv2.INTER_AREA)

    print(f"Resized content img shape: {content_img_resized.shape}")
    print(f"Resized styled img shape: {styled_img_resized.shape}")

    combined_image = np.zeros_like(styled_img_resized)

    for i in range(mask.shape[0]):
        for j in range(mask.shape[1]):
            if not isBgr:
                if mask[i, j]:
                    combined_image[i, j] = styled_img_resized[i, j]
                else:
                    combined_image[i, j] = content_img_resized[i, j]
            else:
                if not mask[i, j]:
                    combined_image[i, j] = styled_img_resized[i, j]
                else:
                    combined_image[i, j] = content_img_resized[i, j]

    combined_image_bgr = cv2.cvtColor(combined_image, cv2.COLOR_RGB2BGR)

    output_dir = os.path.join(os.getcwd(), 'data')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_path = os.path.join(output_dir, output_filename)
    cv2.imwrite(output_path, combined_image_bgr)

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


@app.post("/uploadfile/box/segment")
async def create_upload_file(file: UploadFile = File(...), box: str = Form(...)):
    print('File Received. Starting Processing')
    try:
        box: Box = json.loads(box)
        print('Box Received: ', box)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for points")

    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segmented_image_path = process_image_with_model_and_get_output_path(file.filename, box, sam_predictor)
    return FileResponse(segmented_image_path)

@app.post("/uploadfile/box")
async def create_upload_file(file: UploadFile = Union[File(...), None], style_file: UploadFile = Union[File(...), None], box: str = Form(...), isBgr: bool = Form(...)):
    print('File Received. Starting Processing')
    try:
        box: Box = json.loads(box)
        print('Box Received: ', box)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for points")

    content_img_path = os.path.join(os.getcwd(), file.filename)
    with open(content_img_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    style_img_path = os.path.join(os.getcwd(), style_file.filename)
    with open(style_img_path, "wb") as buffer:
        shutil.copyfileobj(style_file.file, buffer)

    mask = process_image_with_model_and_get_mask(content_img_path, box, sam_predictor)

    output_path = transfer_style(mask, content_img_path, style_img_path, isBgr, output_filename="styled_output.jpg")

    return FileResponse(output_path)


device = "cuda" if torch.cuda.is_available() else "cpu"

model, preprocess = clip.load('ViT-B/32', device=device)

ImageFile.LOAD_TRUNCATED_IMAGES = True

description_map = {
    "Camille Pissarro - Boulevard Montmartre.jpg": "A bustling city view of Boulevard Montmartre in Paris",
    "Edvard Munch - Anxiety.jpg": "A painting depicting collective anxiety under a blood-red sky",
    "Edvard Munch - The Scream.jpg": "A figure with an agonized expression against a turbulent orange sky",
    "Katsushika Hokusai - Fine Breezy Day.jpg": "A clear day with a gentle breeze in a traditional Japanese style",
    "Katsushika Hokusai - The Great Wave off Kanagawa.jpg": "A large wave towering over boats near Kanagawa",
    "Leonardo Da Vinci - Lady with an Ermine.jpg": "A portrait of Cecilia Gallerani holding an ermine",
    "Leonardo Da Vinci - Portrait of Lisa Gherardini.jpg": "The Mona Lisa, featuring Lisa Gherardini with a serene smile",
    "Lubo Kristek - Naddas Chord in the Landscape.jpg": "An abstract composition with surreal elements",
    "Oscar Florianus Bluemner - Old Canal Port.jpg": "A vivid, dynamic expressionist depiction of an old canal port",
    "Paul Nash - The Menin Road.jpg": "A desolated landscape of The Menin Road after World War I",
    "Salvador Dali - The Persistence of Memory.jpg": "Melting clocks in a desolate landscape, symbolizing the relativity of time",
    "Vincent Van Gogh - Le caf de nuit.jpg": "A cafe interior at night in Arles",
    "Vincent Van Gogh - Sunflowers.jpg": "Vibrant sunflowers in a vase, demonstrating unique style",
    "Vincent Van Gogh - The bedroom.jpg": "Van Gogh's bedroom in Arles, with bold colors",
    "Vincent Van Gogh - The Olive Trees.jpg": "A grove of olive trees under a tumultuous sky",
    "Vincent Van Gogh - The Starry Night (1888).jpg": "An earlier version of Van Gogh's Starry Night",
    "Vincent Van Gogh - The Starry Night.jpg": "A dreamy interpretation of the night sky over Saint-Rémy-de-Provence",
    "Vincent Van Gogh - The Yellow House.jpg": "The house Van Gogh lived in in Arles, with bright yellow walls"
}

def load_and_preprocess_images(dataset_directory):
    image_features = []
    filenames = []
    for filename in tqdm(os.listdir(dataset_directory)):
        try:
            image_path = os.path.join(dataset_directory, filename)
            image = Image.open(image_path).convert("RGB")
            image = preprocess(image).unsqueeze(0).to(device)
            image_features.append(model.encode_image(image))
            filenames.append(filename)
        except (IOError, OSError) as e:
            print(f"Error processing image {filename}: {e}")
            continue

    return torch.cat(image_features, dim=0), filenames

def find_similar_images(text, image_features, filenames, top_k=3):
    text_tokens = clip.tokenize([text]).to(device)
    with torch.no_grad():
        text_features = model.encode_text(text_tokens)
        similarities = (text_features @ image_features.T).squeeze(0)
        top_images_indices = similarities.topk(top_k).indices.tolist()

    return [filenames[i] for i in top_images_indices]

def calculate_recall_at_5(recommended_images, description):
    relevant_images = [filename for filename, desc in description_map.items() if description.lower() in desc.lower()]
    recommended_set = set(recommended_images)
    relevant_set = set(relevant_images)
    recall_at_5 = len(recommended_set.intersection(relevant_set)) / len(relevant_set) if relevant_set else 0
    return recall_at_5


@app.post("/recommend")
async def recommend_images(prompt: str):
    try:
        recommendations = find_similar_images(prompt, image_features, filenames)
        recall_score = calculate_recall_at_5(recommendations, prompt)
        response = {
            "recommended_images": recommendations,
            "recall_at_5": recall_score
        }
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    global image_features, filenames
    dataset_directory = f"{os.getcwd()}/painting_collection"
    image_features, filenames = load_and_preprocess_images(dataset_directory)


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