# -*- coding: utf-8 -*-
"""
Created on Fri Aug  7 08:37:14 2020

@author: yogesh.kuma
"""

# Import libraries...

import warnings
warnings.simplefilter("ignore")
import numpy as np
from numpy import asarray
import os
import random
from keras.preprocessing.image import ImageDataGenerator,load_img,img_to_array
import sys
import cv2
import glob as glob
import math as m
from cv2 import dnn_superres
# for gamma function, called 
from scipy.special import gamma as tgamma
from PIL import Image
from collections import Counter
import matplotlib.image as mpimg

class ImageProcessing:
    
    """
    #Class to process Images...
    """
    
###################################################################################
#Input - pic,rotation,shift,shear,zoom,fill_mode
#Output - image data and data generator object  
#Defination - pre_process takes the input and perform the operation over the image
###################################################################################   
  

    def pre_process(self,pic,rotation,shift,shear,zoom,fill_mode):
         # set up your data generator
        datagen = ImageDataGenerator(
        featurewise_center=True,
        featurewise_std_normalization=True,
        rotation_range=rotation,
        width_shift_range=shift,
        height_shift_range=shift,
        shear_range=shear,
        zoom_range=zoom,
        horizontal_flip=True,
        vertical_flip = True,fill_mode=fill_mode)    
          
        pic_array=img_to_array(pic)             
        pic_array=pic_array.reshape((1,)+pic_array.shape)
        
        return pic_array,datagen


# Checklist returns True if all List elements are same
    def chkList(self,lst): 
        return len(set(lst)) == 1
    
    def auto_canny(self,image, sigma=0.33):
    	# compute the median of the single channel pixel intensities
    	v = np.median(image)
     
    	# apply automatic Canny edge detection using the computed median
    	lower = int(max(0, (1.0 - sigma) * v))
    	upper = int(min(255, (1.0 + sigma) * v))
    	edged = cv2.Canny(image, lower, upper)
     
    	# return the edged image
    	return edged

###################################################################################
#Input -  # AGGD fit model, takes input as the MSCN Image / Pair-wise Product
#Output - best values of image parameters 
#Defination - used as internal method to measure_ImageQualityScore
###################################################################################
    
   
    def AGGDfit(self,structdis):
        # variables to count positive pixels / negative pixels and their squared sum
        poscount = 0
        negcount = 0
        possqsum = 0
        negsqsum = 0
        abssum   = 0
    
        poscount = len(structdis[structdis > 0]) # number of positive pixels
        negcount = len(structdis[structdis < 0]) # number of negative pixels
        
        # calculate squared sum of positive pixels and negative pixels
        possqsum = np.sum(np.power(structdis[structdis > 0], 2))
        negsqsum = np.sum(np.power(structdis[structdis < 0], 2))
        
        # absolute squared sum
        abssum = np.sum(structdis[structdis > 0]) + np.sum(-1 * structdis[structdis < 0])
    
        # calculate left sigma variance and right sigma variance
        lsigma_best = np.sqrt((negsqsum/negcount))
        rsigma_best = np.sqrt((possqsum/poscount))
    
        gammahat = lsigma_best/rsigma_best
        
        # total number of pixels - totalcount
        totalcount = structdis.shape[1] * structdis.shape[0]
    
        rhat = m.pow(abssum/totalcount, 2)/((negsqsum + possqsum)/totalcount)
        rhatnorm = rhat * (m.pow(gammahat, 3) + 1) * (gammahat + 1)/(m.pow(m.pow(gammahat, 2) + 1, 2))
        
        prevgamma = 0
        prevdiff  = 1e10
        sampling  = 0.001
        gam = 0.2
    
        # vectorized function call for best fitting parameters
        vectfunc = np.vectorize(self.func, otypes = [np.float], cache = False)
        
        # calculate best fit params
        gamma_best = vectfunc(gam, prevgamma, prevdiff, sampling, rhatnorm)
    
        return [lsigma_best, rsigma_best, gamma_best] 
    
    def func(self,gam, prevgamma, prevdiff, sampling, rhatnorm):
        while(gam < 10):
            r_gam = tgamma(2/gam) * tgamma(2/gam) / (tgamma(1/gam) * tgamma(3/gam))
            diff = abs(r_gam - rhatnorm)
            if(diff > prevdiff): break
            prevdiff = diff
            prevgamma = gam
            gam += sampling
        gamma_best = prevgamma
        return gamma_best
    
    def compute_features(self,img):
        scalenum = 2
        feat = []
        # make a copy of the image 
        im_original = img.copy()
    
        # scale the images twice 
        for itr_scale in range(scalenum):
            im = im_original.copy()
            # normalize the image
            im = im / 255.0
    
            # calculating MSCN coefficients
            mu = cv2.GaussianBlur(im, (7, 7), 1.166)
            mu_sq = mu * mu
            sigma = cv2.GaussianBlur(im*im, (7, 7), 1.166)
            sigma = (sigma - mu_sq)**0.5
            
            # structdis is the MSCN image
            structdis = im - mu
            structdis /= (sigma + 1.0/255)
            
            # calculate best fitted parameters from MSCN image
            best_fit_params = self.AGGDfit(structdis)
            # unwrap the best fit parameters 
            lsigma_best = best_fit_params[0]
            rsigma_best = best_fit_params[1]
            gamma_best  = best_fit_params[2]
            
            # append the best fit parameters for MSCN image
            feat.append(gamma_best)
            feat.append((lsigma_best*lsigma_best + rsigma_best*rsigma_best)/2)
    
            # shifting indices for creating pair-wise products
            shifts = [[0,1], [1,0], [1,1], [-1,1]] # H V D1 D2
    
            for itr_shift in range(1, len(shifts) + 1):
                OrigArr = structdis
                reqshift = shifts[itr_shift-1] # shifting index
    
                # create transformation matrix for warpAffine function
                M = np.float32([[1, 0, reqshift[1]], [0, 1, reqshift[0]]])
                ShiftArr = cv2.warpAffine(OrigArr, M, (structdis.shape[1], structdis.shape[0]))
                
                Shifted_new_structdis = ShiftArr
                Shifted_new_structdis = Shifted_new_structdis * structdis
                # shifted_new_structdis is the pairwise product 
                # best fit the pairwise product 
                best_fit_params = self.AGGDfit(Shifted_new_structdis)
                lsigma_best = best_fit_params[0]
                rsigma_best = best_fit_params[1]
                gamma_best  = best_fit_params[2]
    
                constant = m.pow(tgamma(1/gamma_best), 0.5)/m.pow(tgamma(3/gamma_best), 0.5)
                meanparam = (rsigma_best - lsigma_best) * (tgamma(2/gamma_best)/tgamma(1/gamma_best)) * constant
    
                # append the best fit calculated parameters            
                feat.append(gamma_best) # gamma best
                feat.append(meanparam) # mean shape
                feat.append(m.pow(lsigma_best, 2)) # left variance square
                feat.append(m.pow(rsigma_best, 2)) # right variance square
            
            # resize the image on next iteration
            im_original = cv2.resize(im_original, (0,0), fx=0.5, fy=0.5, interpolation=cv2.INTER_CUBIC)
        return feat



        






        

    def img_Simulation(self,in_dir,factor,out_dir,out_extension='png',rotation=True,shift=True,shear=True,zoom=True,flip=True,fill_mode='nearest'):
        
        """
        ####################################################################################
        #Input - img_path,ImageCount,out_dir,rotation=True/False,shift=True/False,shear=True/False,zoom=True/False,flip=True/False, fill_mode=['nearest','reflect','wrap','constant']
        #Output - [ImageCount] sampled augmented images  
        #Defination - img_Simulation takes the input and save the sample images in output directory
        #################################################################################### 
    
        """
        
        if os.path.isdir(in_dir)==False:
            print("folder does not exist")
            sys.exit()  
            
        if os.path.isdir(out_dir)==False:
            print("folder does not exist")
            sys.exit()


                         
        if not type(factor) is int:
            raise TypeError("Only integers for image count are allowed")
            
        if (rotation not in [True,False]):
            raise TypeError("Only True and False are allowed for rotation...")            

        if (shift not in [True,False]):
            raise TypeError("Only True and False are allowed for shift...")
            
        if (shear not in [True,False]):
            raise TypeError("Only True and False are allowed for shear...") 
            
        if (zoom not in [True,False]):
            raise TypeError("Only True and False are allowed for zoom...")
            
        if (flip not in [True,False]):
            raise TypeError("Only True and False are allowed for flip...")
            
        if (fill_mode not in ['nearest','reflect','wrap','constant']):
            raise TypeError("Only nearest,reflect,wrap and constant are allowed for fill_mode...")            
            
            
                    
        try:
            for img_path in glob.glob(in_dir + '*.*'):
                pic=load_img(img_path)
                out_dir_file = out_dir+os.path.basename(img_path[:-4])
                if os.path.isdir(out_dir_file) == False:
                    os.makedirs(out_dir_file)

                if rotation==True:
                    rotation=[15,30,45,60,75,90,105,120,135,150,165,180]
                    rotation= random.choice(rotation)
                else:
                    rotation=0
                
                if shift==True:
                    shift=[.1,.2,.3]
                    shift= random.choice(shift)
                else:
                    shift=0
                
                if shear==True:
                    shear=[.1,.2,.3]
                    shear= random.choice(shear)
                else:
                    shear=0
                
                if zoom==True:                
                    zoom=[.1,.2,.3]
                    zoom= random.choice(zoom)
                else:
                    zoom=0 
                    
                if flip==True:                
                    flip=True
                else:
                    flip=False     
                
                # Call Pre_Process
                pic_array,datagen = self.pre_process(pic,rotation,shift,shear,zoom,fill_mode)         
    
                
                count=0
                for batch in datagen.flow(pic_array,batch_size=1,save_to_dir=out_dir_file,save_format=out_extension):
                    count+=1
                    if count==int(factor):
                        break
           
        except:
              print(sys.exc_info())
        finally:
            warnings.simplefilter("ignore")             
        
        return "Sample Images generated in output directory..."



    def img_Resize(self,in_dir,out_dir,width,height):
        
        
        """
        ####################################################################################
        #Input - in_dir,out_dir,height>49 and width>49 
        #Output -  given size images generated in out_dir  
        #Defination - img_Resize takes the input and save the desired size images in output directory
        #################################################################################### 
    
        """
        
        if os.path.isdir(in_dir)==False:
            print("folder does not exist")
            sys.exit()  

        if os.path.isdir(out_dir)==False:
            print("folder does not exist")
            sys.exit()
            
        if (width<50 or height<50) :
            print("width and height should be greater than 49...")
            sys.exit()
        try:    
            for item in os.listdir(in_dir):
               # print(item)
                if os.path.isfile(in_dir + item):
                    im = Image.open(in_dir + item)
                    f, e = os.path.splitext(in_dir + item)
                    imResize = im.resize((width,height), Image.ANTIALIAS)
                    imResize.save(out_dir + "resized" + item, 'png', quality=90)
        except:
              print(sys.exc_info())
        finally:
            warnings.simplefilter("ignore")                    
                
                
        return "Resized Images generated in OutPut directory" 


    # calculate moode
    def mode(self,arr):
        if arr==[]:
            return None
        else:
            return max(set(arr), key=arr.count)
        
        
    def img_EDA(self,in_dir):
        
        """
        ####################################################################################
        #Input - in_dir with all type of Images
        #Output -  mean,median and mode image size, channels type, extensions, recommendation of images etc
        #Defination - img_EDA takes the all images and print the EDA results
        #################################################################################### 
    
        """
        # check input directory
        
        if os.path.isdir(in_dir)==False:
            print("folder does not exist")
            sys.exit()  
        
        width_list=[]
        height_list=[]
        k=[]
        c=[]
        cnum=[]
        v=[] 
        ext=[]               
        cnt=0
        for item in os.listdir(in_dir):
           
            if os.path.isfile(in_dir + item):
                im = Image.open(in_dir + item)
                c.append(im.mode)
                cnum.append(len(im.mode))
                width_list.append(im.width)
                height_list.append(im.height)
                k.append(im.size)
                v.append(im.width*im.height)
                f, e = os.path.splitext(in_dir + item)
                ext.append(e)
                cnt=cnt+1
                
        # calculate biggest and smallest image
        img_dict={}
        for key, val in zip(k, v): 
            img_dict[key] = val
            
        max_key = max(img_dict, key=img_dict.get)    
        max_key    
        
        min_key = min(img_dict, key=img_dict.get)    
        min_key
        
        
        print('*-----------------------<<< RESULTS >>>-------------------------*')
        print()
        print('%-30s | ' % 'Channels', set(c))
        print('%-30s | ' % 'Extensions', set(ext))
        print('*---------------------------------------------------------------*')
        
        print('%-30s | ' % 'Total Images', cnt)
        
        print('%-30s | ' % 'Smallest Image', min_key)
        
        print('%-30s | ' % 'Largest Image', max_key)
        
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'Mean Width', int(np.mean(width_list)))
        
        print('%-30s | ' % 'Mean Height', int(np.mean(height_list)))            
                    
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'Median Width', int(np.median(width_list)))
        
        print('%-30s | ' % 'Median Height', int(np.median(height_list))) 
        
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'Mode Width', int(self.mode(width_list)))
        
        print('%-30s | ' % 'Mode Height', int(self.mode(height_list))) 
        
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'recommended size by mean(w,h)',(int(np.mean(width_list)),int(np.mean(height_list))))
        
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'recommended size by median(w,h)',(int(np.median(width_list)),int(np.median(height_list))))
        
        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'recommended size by mode(w,h)',(int(self.mode(width_list)),int(self.mode(height_list))))
        

        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'distribution of sizes',dict(Counter(k).items()) )

        print('*---------------------------------------------------------------*')
        print('%-30s | ' % 'channel mean',np.mean(cnum))
        print('%-30s | ' % 'channel standard deviation',np.std(cnum))
                
                   
        return       


    def img_Normalize(self,in_dir):
        
        """
        ####################################################################################
        #Input - in_dir 
        #Output -  numpy ndarray
        #Defination - img_Normalize takes the all same size images and returns the Normalized ndarray
        #################################################################################### 
    
        """
        # check input directory
        
        if os.path.isdir(in_dir)==False:
            print("folder does not exist")
            sys.exit()  
        
        width_list=[]
        height_list=[]

        c=[]
        cnum=[]

        for item in os.listdir(in_dir):
           
            if os.path.isfile(in_dir + item):
                im = Image.open(in_dir + item)
                c.append(im.mode)
                cnum.append(len(im.mode))
                width_list.append(im.width)
                height_list.append(im.height)              
                
          

        if self.chkList(width_list)==False:
            print("all Images does not have same size, Please Resize all images with same dimention... ")
            sys.exit()
            
        if self.chkList(height_list)==False:
            print("all Images does not have same size, Please Resize all images with same dimention... ")
            sys.exit()                   


        if self.chkList(cnum)==False:
            print("all Images does not have same channel, Please keep all images with same dimention... ")
            sys.exit()

        # Initialize empty array of same size
        ini_array=np.empty((width_list[0],height_list[0],cnum[0]))
        #print(ini_array.shape)
        for pic in os.listdir(in_dir):
           
            if os.path.isfile(in_dir + pic):
                im = Image.open(in_dir + pic)
                pixels = asarray(im)
                # convert from integers to floats
                pixels = pixels.astype('float32')
                # normalize to the range 0-1
                pixels /= 255.0                
                ini_array = np.vstack ((ini_array, pixels.transpose(1,0,2)))
                                
         
        arr_sliced = ini_array[width_list[0]:]
#        print(ini_array.shape)
#        print(arr_sliced.shape)
        return arr_sliced  


    def img_GreyScale(self,in_dir,out_dir):        
        """
        ####################################################################################
        #Input - in_dir 
        #Output -  Greyscale images
        #Defination - out_dir + item takes input images and returns the GreyScale Images in output drectory
        #################################################################################### 
    
        """
        # check input directory
        
        if os.path.isdir(in_dir)==False:
            print("folder does not exist")
            sys.exit()
            
        for item in os.listdir(in_dir):

            if os.path.isfile(in_dir + item):
                im = cv2.imread(in_dir + item)
                gray=cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
                print(out_dir + item)
                cv2.imwrite(out_dir + "gray_"+item, gray)
          
        
        return  "Grey Scaled Image saved in ouput directory..."
    
    def img_IndentifyObject(self,img_path):
    
        """
        ####################################################################################
        #Input - imagePath 
        #Output -  objects contours detected
        #Defination - Objects contours detyected using canny algorthim
        #################################################################################### 
    
        """
        # check input path
        
        if os.path.isfile(img_path)==False:
            print("file does not exist")
            sys.exit()
           
        	# load the image, convert it to grayscale, and blur it slightly
        image = cv2.imread(img_path)
        image = cv2.fastNlMeansDenoisingColored(image,None,10,10,7,21)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # morphology
        kernel = np.ones((5,5),np.uint8)
        closing = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
        blurred = cv2.medianBlur(closing,5)
      
        
        auto = self.auto_canny(blurred)         
        # show the images
        cv2.imshow("Edges", np.hstack([auto])) 
        cv2.waitKey(0)

        return