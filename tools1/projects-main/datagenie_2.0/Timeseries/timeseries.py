import csv
import json
import datetime

import pandas
import configparser

def read_CSV_to_JSON():
    config_parser = configparser.ConfigParser()
    config_parser.read("config.ini")
    dateColumnName = config_parser.get("date_column", "column_name")

    #filename = "data_test_2000.csv"
    filename = "uci-secom.csv"

    columns = []
    data = pandas.read_csv(filename)
    for col in data.columns:
        columns.append(col)
    print(columns)
    print(tuple(columns))

    csvfile = open(filename, 'r')
    reader = csv.DictReader(csvfile, tuple(columns))
    data_list = list()
    for row in reader:
        csv_data = json.dumps(row)
        device_reading = json.loads(csv_data)
        if dateColumnName != "":
            if dateColumnName in device_reading.keys():
                device_reading[dateColumnName] = str(datetime.datetime.utcnow())
        data_list.append(device_reading)
    csvfile.close()
    print(json.dumps(data_list))
    return json.dumps(data_list)


if __name__ == '__main__':
    read_CSV_to_JSON()
