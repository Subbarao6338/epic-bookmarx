import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import IsolationForest
# data = pd.read_csv('C:/Users/cdpwinuser/Desktop/multivarient_data.csv')
# data.head(10)
#
# random_state = np.random.RandomState(42)
#
#
# model=IsolationForest(n_estimators=100,max_samples='auto',contamination=float(0.2),random_state=random_state)
#
# model.fit(data)
#
# print(model.get_params())
#
#
# data['scores'] = model.decision_function(data)
#
# data['anomaly_score'] = model.predict(data)
# # data.head()
#
# data[data['anomaly_score']==-1].head()


def multi_anomaly_detection(filepath):
    uploaded_data = pd.read_csv(filepath)
    # uploaded_data = pd.DataFrame(uploaded_data[selected_param])
    print(uploaded_data)
    col=uploaded_data.columns
    random_state = np.random.RandomState(42)
    # model_name = 'iforest'
    model = IsolationForest(n_estimators=100,max_samples='auto',contamination=float(0.2),random_state=random_state)
    model.fit(uploaded_data[col])
    print(model.get_params())
    uploaded_data['scores'] = model.decision_function(
        uploaded_data[col])
    uploaded_data['anomaly_score'] = model.predict(
        uploaded_data[col])
    var = uploaded_data[uploaded_data['anomaly_score'] == -1]
    print(var)



file_path = "D:/Downloads/input/multivarient_data.csv"
# model = "IsolationForest"
multi_anomaly_detection(file_path)