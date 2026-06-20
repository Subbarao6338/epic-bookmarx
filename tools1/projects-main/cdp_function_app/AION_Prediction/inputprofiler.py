import pandas as pd
import joblib
import os
from word2number import w2n
import numpy as np
class inputprofiler(object):
    def s2n(self,value):
        try:
            x=eval(value)
            return x
        except:
            try:
                return w2n.word_to_num(value)
            except:
                return np.nan 
    def apply_profiler(self,df):
        if 'volt' in df.columns:
            df['volt'] = df['volt'].fillna(value='170.52333355000002')
        if 'rotate' in df.columns:
            df['rotate'] = df['rotate'].fillna(value='447.59271390000004')
        if 'vibration' in df.columns:
            df['vibration'] = df['vibration'].fillna(value='40.244420825')
        return(df)