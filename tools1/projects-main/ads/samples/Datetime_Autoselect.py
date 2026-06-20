import pandas as pd

df = pd.read_csv("D:\samples\request_data_2.csv")

for col in df.columns:
    if df[col].dtype == 'object':
        try:
            df[col] = pd.to_datetime(df[col])
        except ValueError:
            pass

df.dtypes
# (object, datetime64[ns], int64)