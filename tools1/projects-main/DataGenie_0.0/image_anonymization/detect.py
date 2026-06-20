import cv2
import os
from pathlib import Path

current_folder = Path(__file__).parent.resolve()

def detect_face(gray_image):
    detector = cv2.CascadeClassifier(os.path.join(current_folder,"models/haarcascade_frontalface_default.xml"))
    face_cords = detector.detectMultiScale(gray_image, scaleFactor=1.05, minNeighbors=3,minSize=(30, 30))
    return face_cords

def detect_np(gray_image):
     detector = cv2.CascadeClassifier(os.path.join(current_folder,"models/haarcascade_russian_plate_number.xml"))
     plate_cords = detector.detectMultiScale(gray_image,scaleFactor=1.05, minNeighbors=5,minSize=(30, 30))
     return plate_cords

def blur_image(image,cords):
    for x, y, w, h in cords:
        blur_image = image[y:y+h, x:x+w]
        blurred_image = cv2.GaussianBlur(blur_image,(23, 23), 30)
        image[y:y+blur_image.shape[0], x:x+blur_image.shape[1]] = blurred_image
    return image


def detect_and_blur(image_path):
    image_name = os.path.basename(image_path)
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    face_cords = detect_face(gray_image)
    blurred_image = blur_image(image, face_cords)

    np_cords = detect_np(gray_image)
    blurred_image = blur_image(blurred_image,np_cords)
    
    # cv2.imshow("output image",blurred_image)
    # cv2.waitKey(0)
    cv2.imwrite(os.path.join(current_folder,'output_img', image_name), blurred_image)
    cv2.imwrite(os.path.join(current_folder,'output_img', 'latest.jpg'), blurred_image)




