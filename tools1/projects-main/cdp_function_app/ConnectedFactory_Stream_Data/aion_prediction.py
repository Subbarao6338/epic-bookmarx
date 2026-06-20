import warnings
warnings.filterwarnings("ignore")
import json
import os
import sys
import pandas as pd
from pandas.io.json import json_normalize
from ConnectedFactory_Stream_Data.selector import selector
from ConnectedFactory_Stream_Data.inputprofiler import inputprofiler
from ConnectedFactory_Stream_Data.trained_model import trained_model
from ConnectedFactory_Stream_Data.output_format import output_format

def predict(data):
    try:
        # jsonData = json.loads(data)
        # df = json_normalize(jsonData)
        df = data
        df0 = df.copy()
        profilerobj = inputprofiler()
        df = profilerobj.apply_profiler(df)
        selectobj = selector()
        df = selectobj.apply_selector(df)
        modelobj = trained_model()
        output = modelobj.predict(df,"")
        outputobj = output_format()
        output = outputobj.apply_output_format(df0,output)
        # print("predictions:",output)
        return(output)
    except KeyError as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        print("predictions:",json.dumps(output))
        return (json.dumps(output))
    except Exception as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        print("predictions:",json.dumps(output))
        return (json.dumps(output))
# if __name__ == "__main__":
#     with open('input.json') as json_file:
#         output = predict(json.dumps(json.load(json_file)))