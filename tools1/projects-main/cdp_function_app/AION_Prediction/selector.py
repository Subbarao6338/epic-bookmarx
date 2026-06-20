import pandas as pd
import joblib
import os
import numpy as np
class selector(object):
    def apply_selector(self,df):
        df = df[['volt', 'rotate', 'vibration']]
        return(df)