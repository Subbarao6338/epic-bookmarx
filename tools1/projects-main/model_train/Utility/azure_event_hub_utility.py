import json
import os

from avro.datafile import DataFileReader
from avro.io import DatumReader
from azure.eventhub import EventHubProducerClient, EventData
from azure.storage.blob import ContainerClient


def send_event_to_hub(event_hub_conn, event_hub_name, event_json_str):
    try:
        event_hub_producer = EventHubProducerClient.from_connection_string(
            conn_str=event_hub_conn, eventhub_name=event_hub_name)
        with event_hub_producer:
            event_data_batch = event_hub_producer.create_batch()
            event_data_batch.add(EventData(event_json_str))
            event_hub_producer.send_batch(event_data_batch)
        return True
    except Exception as e:
        print(e)
        return False


list_event = []


def process_data(filename):
    reader = DataFileReader(open(filename, 'rb'), DatumReader())
    for reading in reader:
        parsed_json = json.loads(reading["Body"])
        list_event.append(parsed_json)
    reader.close()


def receive_event_from_hub(storage_conn, container_name):
    print('Processor started using path: ' + os.getcwd())
    container = ContainerClient.from_connection_string(storage_conn,
                                                       container_name=container_name)
    blob_list = container.list_blobs()
    for blob in blob_list:
        if blob.size > 508:
            print('Downloaded a non empty blob: ' + blob.name)
            blob_client = ContainerClient.get_blob_client(container, blob=blob.name)
            blob_name = str.replace(blob.name, '/', '_')
            blob_name = os.getcwd() + '\\' + blob_name
            with open(blob_name, "wb+") as my_file:
                my_file.write(blob_client.download_blob().readall())
            process_data(blob_name)
            os.remove(blob_name)
            container.delete_blob(blob.name)
    return list_event
