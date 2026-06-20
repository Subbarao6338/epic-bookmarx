"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""


def sql_type_switcher(args):

    args = args.lower()
    if args.startswith('varchar'):
        args = "varchar"
    if args.startswith('nvarchar'):
        args = "nvarchar"
    if args.startswith('int'):
        args = "int"
    if args.startswith('bool'):
        args = "bool"

    #print(args)

    switcher = {
        'bit': '-7',
        'datetime': '9',
        'image': '-3',
        'int': '4',
        'money': '6',
        'nchar': '12',
        'ntext': '12',
        'nvarchar': '12',
        'real': '7',
        'smallint': '5',
        'varchar': '12',
        'decimal': '3',
        'double': '8',
        'tinyint': '-6',
        'guid': '-11',
        'bigint': '-5',
        'float': '6',
        'boolean': '-7',
        'bool': '-7',
        'char': '1',
        'n': '3',
        's': '12'

    }
    return switcher.get(args, '0')