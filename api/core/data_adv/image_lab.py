import cv2
import os
import numpy as np
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"

def detect_face(gray_image):
    model_path = str(MODELS_DIR / "haarcascade_frontalface_default.xml")
    if not os.path.exists(model_path): return []
    detector = cv2.CascadeClassifier(model_path)
    return detector.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

def detect_plates(gray_image):
    model_path = str(MODELS_DIR / "haarcascade_russian_plate_number.xml")
    if not os.path.exists(model_path): return []
    detector = cv2.CascadeClassifier(model_path)
    return detector.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

def blur_regions(image, cords):
    for (x, y, w, h) in cords:
        roi = image[y:y+h, x:x+w]
        blurred_roi = cv2.GaussianBlur(roi, (25, 25), 30)
        image[y:y+h, x:x+w] = blurred_roi
    return image

def anonymize_image(image_path, output_path):
    image = cv2.imread(image_path)
    if image is None: raise ValueError("Could not read image")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = detect_face(gray)
    image = blur_regions(image, faces)

    plates = detect_plates(gray)
    image = blur_regions(image, plates)

    cv2.imwrite(output_path, image)
    return len(faces) + len(plates)

def simulate_image_transform(image_path, output_path, transform_type):
    img = cv2.imread(image_path)
    if img is None: raise ValueError("Could not read image")

    if transform_type == 'flip':
        res = cv2.flip(img, 1)
    elif transform_type == 'rotate':
        (h, w) = img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, 45, 1.0)
        res = cv2.warpAffine(img, M, (w, h))
    elif transform_type == 'grayscale':
        res = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        res = img

    cv2.imwrite(output_path, res)
