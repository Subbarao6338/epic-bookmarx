from AIX import ImageProcessing
import os
import glob

image_dir = "C:/Users/azureuser/Desktop/OutputImages"

for dir in os.listdir(image_dir):
    img = ImageProcessing()
    ImageProcessing.img_GreyScale(self=img, in_dir=image_dir + '/' + dir + '/', out_dir=image_dir + '/' + dir + '/')
