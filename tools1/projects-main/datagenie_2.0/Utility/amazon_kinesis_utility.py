import boto3
# my_stream_name = 'CDP-Kinesis'
# aws_access_key_id = 'AKIA6BQ7EC7FZIZHUQGR'
# aws_secret_access_key = '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'
# region_name = 'us-west-2'
def send_message_to_kinesis(aws_access_key_id, aws_secret_access_key, region_name,my_stream_name,event_str):
    kinesis_client = boto3.client('kinesis',aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key,region_name=region_name)
    thing_id = 'kinesis-demo'
    try:
        put_response = kinesis_client.put_record(
            StreamName=my_stream_name,
            Data=event_str,
            PartitionKey=thing_id)
        return True
    except Exception as e:
        print(e)
        return False





































