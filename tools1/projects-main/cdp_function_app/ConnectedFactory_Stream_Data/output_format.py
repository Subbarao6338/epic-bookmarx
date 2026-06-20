import json
import numpy as np
import pandas as pd
import os
class output_format(object):
    def apply_output_format(self,df,modeloutput):
        modeloutput = round(modeloutput,2)
        df['prediction'] = modeloutput.idxmax(axis=1)
        df['probability'] = modeloutput.max(axis=1).round(2)
        df['remarks'] = modeloutput.apply(lambda x: x.to_json(), axis=1)
        outputjson = df.to_json(orient='records')
        outputjson = {"status":"SUCCESS","data":json.loads(outputjson)}
        return(json.dumps(outputjson))