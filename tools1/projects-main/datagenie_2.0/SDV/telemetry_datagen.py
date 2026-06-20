from sdv.tabular import GaussianCopula
import warnings
import os
from Utility import connect_azure_sql as azure_sql_conn

warnings.filterwarnings("ignore")
cwdPath = os.path.abspath(os.getcwd())
SDVPath = os.path.join(cwdPath, "SDV")
SDVModelPath = os.path.join(SDVPath, "sdv_models")
output_path = os.path.join(SDVPath, "sdv_telemetry_data.csv")
default_model_path = os.path.join(SDVPath, "telemetry_sdv_model.pkl")
# print('SDVPath :>>', SDVPath)


def generate_telemetry_data(num_rows, file_path=output_path):
    model_name = azure_sql_conn.get_sdv_model_name()
    print(model_name[0])
    select_model_name = os.path.join(SDVModelPath,model_name[0])
    telemetry_sdv_model = GaussianCopula.load(select_model_name)
    new_telemetry = telemetry_sdv_model.sample(num_rows)
    new_telemetry.to_csv(file_path, index=False)
    print("{} rows of telemetry data -> {}".format(num_rows, file_path))
