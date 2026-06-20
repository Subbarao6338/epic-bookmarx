from sdv.tabular import GaussianCopula
import warnings
import os

warnings.filterwarnings("ignore")
cwdPath = os.path.abspath(os.getcwd())
SDVPath = os.path.join(cwdPath, "SDV")
output_path = os.path.join(SDVPath, "sdv_telemetry_data.csv")
default_model_path = os.path.join(SDVPath, "telemetry_sdv_model.pkl")
# print('SDVPath :>>', SDVPath)


def generate_telemetry_data(num_rows=1000, file_path=output_path):
    telemetry_sdv_model = GaussianCopula.load(default_model_path)
    new_telemetry = telemetry_sdv_model.sample(num_rows)
    new_telemetry.to_csv(file_path, index=False)
    print("{} rows of telemetry data -> {}".format(num_rows, file_path))
