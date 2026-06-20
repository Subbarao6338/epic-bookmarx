"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime

def fetchreportsdetails(request):

    create_query='''CREATE TABLE IF NOT EXISTS public."ReportDetails"
                (
                    report_type character varying(30),
                    report_title character varying(100),
                    report_url character varying,
                    report_thumbnail character varying(300),
                    report_provider character varying(50)
                )'''
    postgres_connection.execute_create_query(create_query)

    query = '''select report_type,report_title,report_url,report_thumbnail,report_provider from public."ReportDetails" where status=true'''
    ret = postgres_connection.execute_get_query(query, [])
    return ret

# Insert Query
#-------------
# INSERT INTO public."ReportDetails"(report_type, report_title, report_url, report_thumbnail, report_provider) VALUES ('Dashboards', 'Predictive Maintenance - Batch', 'https://app.powerbi.com/groups/me/reports/f01ef338-aa3a-4292-98aa-7d550ca6e227/ReportSection', 'Dashboard_pm.png', 'PowerBI');
# INSERT INTO public."ReportDetails"(report_type, report_title, report_url, report_thumbnail, report_provider) VALUES ('Dashboards', 'Predictive Maintenance - Real Time', 'https://app.powerbi.com/groups/me/reports/d8eb55ef-ef28-4a4f-9058-c4443721afec/ReportSection', 'Dashboard_tm.png', 'PowerBI');