from Image_Simulation.Image_Processing.AIX import ImageProcessing



    # only one true
    
def only_one_true(input_dir, output_dir, img, rotation, shift, shear, zoom, flip):
    if rotation==True and shift==False and shear==False and zoom==False and flip==False:
        print(rotation)
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=False, zoom=False, flip=False)
                                   
    if rotation==False and shift==True and shear==False and zoom==False and flip==False:
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=False, zoom=False, flip=False)
                                   
    if rotation==False and shift==False and shear==True and zoom==False and flip==False:
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=True, zoom=False, flip=False)
                                   
    if rotation==False and shift==False and shear==False and zoom==True and flip==False:
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=False, zoom=True, flip=False)
                                   
    if rotation==False and shift==False and shear==False and zoom==False and flip==True:
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=False, zoom=False, flip=True)
                                   
    
    # only two true
def only_two_true(input_dir, output_dir, img, rotation, shift, shear, zoom, flip):    
    #1
    if rotation==True and shift==True and shear==False and zoom==False and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
     
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=False, zoom=False, flip=False)
       
    #2                               
    if rotation==False and shift==True and shear==True and zoom==False and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=True, zoom=False, flip=False)  
                                             
    #3                               
    if rotation==False and shift==False and shear==True and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=True, zoom=True, flip=False)
    #4                               
    if rotation==False and shift==False and shear==False and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=False, zoom=True, flip=True)
    #5                               
    if rotation==True and shift==False and shear==False and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=False, zoom=False, flip=True)
    #6                               
    if rotation==True and shift==False and shear==True and zoom==False and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=True, zoom=False, flip=False)
    #7
    if rotation==True and shift==False and shear==False and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=False, zoom=True, flip=False)
    #8                               
    if rotation==False and shift==True and shear==False and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=False, zoom=True, flip=False)
    #9
    if rotation==False and shift==True and shear==False and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=False, zoom=False, flip=True)
    #10
    if rotation==False and shift==True and shear==False and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=False, zoom=True, flip=False)
    
    
    # only three true
def only_three_true(input_dir, output_dir, img, rotation, shift, shear, zoom, flip):   
    #1
    if rotation==True and shift==True and shear==True and zoom==False and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)   
        
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)                           
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=True, zoom=False, flip=False)
               
                                          
    #2                               
    if rotation==False and shift==True and shear==True and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False) 
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)  
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)  
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=True, zoom=True, flip=False)
       
    
    #3                               
    if rotation==False and shift==False and shear==True and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=False, shear=True, zoom=True, flip=True)
    
    #4                               
    if rotation==True and shift==False and shear==False and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
                                   
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=False, zoom=True, flip=True)
    
    #5                               
    if rotation==True and shift==True and shear==False and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=False, zoom=False, flip=True)
        
    
    #6                               
    if rotation==True and shift==False and shear==True and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=True, zoom=True, flip=False)
        
    #7
    if rotation==True and shift==True and shear==False and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=False, zoom=True, flip=False)
        
    #8                               
    if rotation==False and shift==True and shear==False and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=False, zoom=True, flip=True)
        
    #9
    if rotation==False and shift==True and shear==True and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=True, zoom=False, flip=True)
        
    #10
    if rotation==True and shift==False and shear==True and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=True, zoom=False, flip=True)
        
    # only four true
def only_four_true(input_dir, output_dir, img, rotation, shift, shear, zoom, flip):    
    if rotation==True and shift==True and shear==True and zoom==True and flip==False:
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=True, zoom=False, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=True, flip=False)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=True, zoom=True, flip=False)
                                   
    if rotation==False and shift==True and shear==True and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=False, shift=True, shear=True, zoom=True, flip=True)
                                   
    if rotation==True and shift==False and shear==True and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=True)
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=False, shear=True, zoom=True, flip=True)
                                   
    if rotation==True and shift==True and shear==False and zoom==True and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=False, zoom=True, flip=True)
                                   
    if rotation==True and shift==True and shear==True and zoom==False and flip==True:
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=True, zoom=False, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=True)
        
        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                  out_dir=output_dir, rotation=True, shift=True, shear=True, zoom=False, flip=True)
    

def all_five(input_dir, output_dir, img, rotation, shift, shear, zoom, flip):
    if(rotation==True and shift==True and shear==True and zoom==True and flip==True):
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=False, flip=True)
        only_one_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=False)
        only_one_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=False, flip=True)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=False)
        only_two_true(input_dir, output_dir, img, rotation=False, shift=False, shear=False, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=True, zoom=False, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=False, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=False, shear=True, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=False, zoom=True, flip=True)
        only_three_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=True, flip=False)
        only_three_true(input_dir, output_dir, img, rotation=False, shift=True, shear=False, zoom=True, flip=True)
        only_four_true(input_dir, output_dir, img, rotation=True, shift=True, shear=True, zoom=True, flip=False)
        only_four_true(input_dir, output_dir, img, rotation=False, shift=True, shear=True, zoom=True, flip=True)
        only_four_true(input_dir, output_dir, img, rotation=True, shift=False, shear=True, zoom=True, flip=True)
        only_four_true(input_dir, output_dir, img, rotation=True, shift=True, shear=False, zoom=True, flip=True)
        only_four_true(input_dir, output_dir, img, rotation=True, shift=True, shear=True, zoom=False, flip=True)

        ImageProcessing.img_Simulation(self=img,  in_dir=input_dir,  factor=1,
                                   out_dir=output_dir, rotation=True, shift=True, shear=True, zoom=True, flip=True)

def all_other(input_dir, output_dir, img, temp2):
    only_one_true(input_dir, output_dir, img, temp2[0], temp2[1], temp2[2], temp2[3], temp2[4])
    only_two_true(input_dir, output_dir, img, temp2[0], temp2[1], temp2[2], temp2[3], temp2[4])
    only_three_true(input_dir, output_dir, img, temp2[0], temp2[1], temp2[2], temp2[3], temp2[4])
    only_four_true(input_dir, output_dir, img, temp2[0], temp2[1], temp2[2], temp2[3], temp2[4])
    all_five(input_dir, output_dir,img, temp2[0], temp2[1], temp2[2], temp2[3], temp2[4])
    return "Images Generated Successfully !!"


def MyFunction(inp_dir, out_dir, rotation, shift, shear, zoom, flip, grayscale, resize, width, height):
    input_dir = inp_dir
    output_dir = out_dir
    img = ImageProcessing()
    temp = [rotation, shift, shear, zoom, flip, grayscale, resize]
    temp2 = []
    for item in temp:
        if(item=='true'):
            item=True
        else:
            item=False
        temp2.append(item)
        
    if temp2[5] == True:
        ImageProcessing.img_GreyScale(self=img, in_dir=input_dir, out_dir=output_dir)
        
    width_flag = False
    height_flag = False

    if temp2[6]:
        if width and height:
            width_flag = True
            width = int(width)
            height_flag = True
            height = int(height)
            ImageProcessing.img_Resize(self=img, in_dir=input_dir, out_dir=output_dir, width=width, height=height)
            return all_other(input_dir, output_dir, img, temp2)
        else:
            return "Please Enter Width or Height !!"
    else:
        return all_other(input_dir, output_dir, img, temp2)




