try:
    from sklearn.externals import joblib
except:
    import joblib
import os
import pandas as pd
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np
class trained_model(object):
   def __init__(self):
       self.model = joblib.load(os.path.dirname(os.path.abspath(__file__))+"/Classification_Y_AION_26_1.sav")
   def predict(self,X,features_names):
       X = X.astype(np.float32)
       return pd.DataFrame(self.model.predict_proba(X), columns=self.model.classes_)
