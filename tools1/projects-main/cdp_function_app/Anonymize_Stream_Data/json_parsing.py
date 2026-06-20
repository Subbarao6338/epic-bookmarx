import json
import pandas as pd

def json_parse(ap_response, field_mask_rule):
    results = {}
    temp = (ap_response['data'])
    for rule in field_mask_rule:
        for val in temp:
            if len(val['classifications'])!=0:
                for i in range(len(val['classifications'])):
                    if rule in val['classifications'][i]:
                        if not val['column'] in results:
                            results[val['column']] = "mask"
                    else:
                        if not val['column'] in results:
                            results[val['column']] = "encrypt"
    return results