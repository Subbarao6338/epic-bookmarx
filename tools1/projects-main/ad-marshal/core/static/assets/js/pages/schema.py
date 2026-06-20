import csv
from tableschema import Table, Schema
import pandas as pd

filename = 'D:\Downloads\input\Telemetry.csv'
table = Table(filename)
table=table.infer()

df1 = pd.read_csv(filename, header=[0])
df1 = df1.infer_objects()
df1.info()
print("columns:>>>>>>", df1.columns)
print("types:>>>>>>", df1.dtypes)
g = df1.columns.to_series().groupby(df1.dtypes).groups
print("groups:>>>>>>", g)
# int columns
mylist1 = list(df1.select_dtypes(include=['int64','float64']).columns)
print("int list:>>>>>>", mylist1)
# obj columns
mylist2 = list(df1.select_dtypes(include=['object']).columns)
print("obj list:>>>>>>", mylist2)
'''
#json to csv
df=pd.read_json("D:\CDP\Anomaly_Detection_Service\Result_Json\sample06_01_2022-09_07_05.json")
print(df.to_csv("D:\CDP\Anomaly_Detection_Service\Result_Json\sample06_01_2022.csv"))

#print csv
with open('D:\CDP\Anomaly_Detection_Service\Result_Json\sample06_01_2022.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
'''









'''import csv

filename = 'D:\Downloads\input\customer.csv'

with open(filename, 'r') as csvfile:
    reader = csv.reader(csvfile)
    fields = next(reader)  # Reads header row as a list
    rows = list(reader)  # Reads all subsequent rows as a list of lists

for column_number, field in enumerate(fields):  # (0, routers), (1, servers)
    print(field)
    '''#for row in rows:
        #print(row[column_number])
    #print('\n')'''
#from tableschema import Table, Schema

'''
# Create table
table = Table(filename)
table.infer()
# Print schema descriptor
print(table.schema.descriptor)

table.schema.descriptor['missingValues'] = ['', 'N/A']
table.schema.commit()
# print(table.schema.valid)
# print(table.schema.errors)
# print(table.schema.descriptor['type'])
table.schema.save('schema.json')
table.save(filename)
# schema = Schema()
# schema.infer(filename)
# print(schema.descriptor)
# print(schema.cast_row(filename))
# schema.valid # false
# schema.errors

# Print cast rows in a dict form
for keyed_row in table.iter(keyed=True):
    print(keyed_row)

'''
'''df = pd.read_csv(filename)
for col in df:
     print(col,'\n','\n'.join[i for i in df[col]])'''
'''import glob
import pandas as pd

for f in glob.glob(filename):
    # First, read header row, to infer dtypes
    df1 = pd.read_csv(f, header=[0])
    print("columns",df1.columns)
    print("types",df1.dtypes)
    g = df1.columns.to_series().groupby(df1.dtypes).groups
    print("groups",g)
    #df1.select_dtypes(include=['bool'])
    mylist = list(df1.select_dtypes(include=['int64']).columns)
    print("object list",mylist)
    #df1.select_dtypes(include=['Object', 'DateTime']).columns
    # Here you can process df.columns, add it into a dtype_dict, whatever
    from tableschema import Table, Schema

    # Create table
    table = Table(filename)
    table.infer()
    # Print schema descriptor
    print(table.schema.descriptor)
    # Second, reread entire file
    # df1 = pd.read_csv(f, dtype=[])
#data = csv.DictReader(open(filename))
#for row in data:
 #   print(row)
'''

