import pandas as pd
from faker import Faker
# import read_write
import hashlib
import math

class operations():
    def __init__(self, df):
        self.df = df

    def get_df(self):
        return self.df

    def update_df(self, field, value):
        self.df[field] = value

    # def write_df(self, file_path, format):
    #     read_write.write_file(self.df, file_path, format)

    def replace_ip(self, field):
        try:
            length = len(self.df)
            faker = Faker()
            if(type(field)==list):
                for f in field:
                    original = self.df[f].tolist()
                    duplicate = []
                    temp = {}
                    for val in original:
                        if val not in temp:
                            temp[val] = faker.ipv4()
                    
                    for val in original:
                        duplicate.append(temp[val])

                    self.update_df(f, duplicate)
            else:
                original = self.df[field].tolist()
                duplicate = []
                temp = {}
                for val in original:
                    if val not in temp:
                        temp[val] = faker.ipv4()
                
                for val in original:
                    duplicate.append(temp[val])
                
                self.update_df(field, duplicate)
        except Exception as e:
            print('Some Logical Error!')

    def mask_field(self, field):
        try:
            length = len(self.df)
            if(type(field)==list):
                for f in field:
                    original = self.df[f].tolist()
                    duplicate = []
                    for i in range(length):
                        org_val = str(original[i])
                        len_val = len(org_val)
                        temp_duplicate = ''
                        j = 0
                        while (j < len_val):
                            if (j < len_val - 4):
                                temp_duplicate = temp_duplicate + 'X'
                            else:
                                temp_duplicate = temp_duplicate + org_val[j]
                            j = j + 1
                        duplicate.append(temp_duplicate)
                    self.update_df(f, duplicate)
                    print("Field ", f, " Done!!")
                print("Masking Done!!")
            else:
                original = self.df[field].tolist()
                duplicate = []
                for i in range(length):
                    org_val = str(original[i])
                    len_val = len(org_val)
                    temp_duplicate = ''
                    j = 0
                    while (j < len_val):
                        if (j < len_val - 4):
                            temp_duplicate = temp_duplicate + 'X'
                        else:
                            temp_duplicate = temp_duplicate + org_val[j]
                        j = j + 1
                    duplicate.append(temp_duplicate)
                self.update_df(field, duplicate)
                print("Masking Done!!")
        except Exception as e:
            print('Some Logical Error!')

    def replace_values(self, field):
        try:
            length = len(self.df)
            faker = Faker()
            if(type(field)==list):
                for f in field:
                    original = self.df[f].tolist()
                    duplicate = []
                    for i in range(length):
                        if(math.isnan(original[i])):
                            duplicate.append(None)
                        else:
                            org_val = str(original[i])
                            len_val = len(org_val)
                            duplicate.append(faker.numerify('######'))

                    self.update_df(f, duplicate)
                    print("Field ", f, " Done!!")
                print("Replacing Done!!")
            else:
                original = self.df[field].tolist()
                duplicate = []
                for i in range(length):
                    if(math.isnan(original[i])):
                        duplicate.append(None)
                    else:
                        org_val = str(original[i])
                        len_val = len(org_val)
                        duplicate.append(faker.numerify('######'))

                self.update_df(field, duplicate)
                print("Replacing Done!!")
        except Exception as e:
            print('Some Logical Error!')

    def encrypt_field(self, field):
        try:
            length = len(self.df)
            if(type(field)==list):
                for f in field:
                    original = self.df[f].tolist()
                    duplicate = []
                    for i in range(length):
                        convert_to_byte = bytes(str(original[i]), 'utf-8')
                        encoded_message = hashlib.sha1(convert_to_byte)
                        converted = encoded_message.hexdigest()
                        duplicate.append(converted)

                    self.update_df(f, duplicate)
            else:
                original = self.df[field].tolist()
                duplicate = []
                for i in range(length):
                    convert_to_byte = bytes(str(original[i]), 'utf-8')
                    encoded_message = hashlib.sha1(convert_to_byte)
                    converted = encoded_message.hexdigest()
                    duplicate.append(converted)

                self.update_df(field, duplicate)
        except Exception as e:
            print('Some Logical Error!')
