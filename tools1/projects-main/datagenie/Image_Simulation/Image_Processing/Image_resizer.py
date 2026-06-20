from PIL import Image
import os
import glob

image_dir = "C:/Users/azureuser/Desktop/OutputImages"

for dir in os.listdir(image_dir):
    for file in glob.iglob(image_dir+'/'+dir+'/**/*', recursive=True):
        file_name = os.path.basename(file)
        image = Image.open(file)
        image.thumbnail((500, 400))
        image.save(image_dir+'/'+dir+'/500_'+file_name)
        image.thumbnail((400, 400))
        image.save(image_dir+'/'+dir+'/400_'+file_name)
        image.thumbnail((300, 300))
        image.save(image_dir+'/'+dir+'/300_' + file_name)
        image.thumbnail((200, 200))
        image.save(image_dir+'/'+dir+'/200_' + file_name)
