"""Copyright"""
"""
* =============================================================================
* COPYRIGHT NOTICE
* =============================================================================
*  © Copyright HCL Technologies Ltd. 2021, 2022
* Proprietary and confidential. All information contained herein is, and
* remains the property of HCL Technologies Limited. Copying or reproducing the
* contents of this file, via any medium is strictly prohibited unless prior
* written permission is obtained from HCL Technologies Limited.
"""




from confluent_kafka import Consumer, KafkaException, KafkaError
import sys
import getopt
import json
import logging
from pprint import pformat
import pandas as pd
import datetime
import json
import random
import time
from confluent_kafka import Producer
import sys


def delivery_callback(err, msg):
    if err:
        sys.stderr.write('%% Message failed delivery: %s\n' % err)
    else:
        sys.stderr.write(
            'Message= %s | topic= %s | partition= [%d] | offset= %o\n' % (
                msg.value(), msg.topic(), msg.partition(), msg.offset()))


def kafka_send(topic,servers,connection_string):
    # connection_string = "Endpoint=sb://prathamcdpehns.servicebus.windows.net/;" \
    #                     "SharedAccessKeyName=RootManageSharedAccessKey;" \
    #                     "SharedAccessKey=s+qCcNwlLHZS1bg9r0AXeCMCvaT8/ruy+E2/LRkk6rs="
    # servers = 'prathamcdpehns.servicebus.windows.net:9093'
    conf = {
        'bootstrap.servers': servers,  # replace
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': 'Utility/cacert.pem',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': '$ConnectionString',
        'sasl.password': connection_string,  # replace
        'client.id': 'python-example-producer'
    }
    p = Producer(**conf)

    # Write 1-100 to topic
    for i in range(0, 20):
        try:
            reading = {'DeviceName': 'temp_sensor_kafka_1', 'Timestamp': str(datetime.datetime.utcnow()),
                       'Temperature': random.randint(70, 100), 'UVValue': random.random(),
                       'Humidity': random.randint(70, 100), 'source': 'kafka'}
            event_data = json.dumps(reading)

            p.produce(topic, event_data, callback=delivery_callback)

            time.sleep(1)
        except BufferError as e:
            sys.stderr.write(
                '%% Local producer queue is full (%d messages awaiting delivery): try again\n' % len(p))
        p.poll(0)

    # Wait until all messages have been delivered
    sys.stderr.write('%% Waiting for %d deliveries\n' % len(p))
    p.flush()


def stats_cb(stats_json_str):
    stats_json = json.loads(stats_json_str)
    print('\nKAFKA Stats: {}\n'.format(pformat(stats_json)))


def print_usage_and_exit(program_name):
    sys.stderr.write(
        'Usage: %s [options..] <consumer-group> <topic1> <topic2> ..\n' % program_name)
    options = '''
 Options:
  -T <intvl>   Enable client statistics at specified interval (ms)
'''
    sys.stderr.write(options)
    sys.exit(1)


def consume_kafka(topics,group,servers,connection_string):
    # group = '$default'
    # connection_string = "Endpoint=sb://prathamcdpehns.servicebus.windows.net/;" \
    #                     "SharedAccessKeyName=RootManageSharedAccessKey;" \
    #                     "SharedAccessKey=s+qCcNwlLHZS1bg9r0AXeCMCvaT8/ruy+E2/LRkk6rs="
    # servers = 'prathamcdpehns.servicebus.windows.net:9093'
    # Consumer configuration
    # See https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
    conf = {
        'bootstrap.servers': servers,  # update
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': 'Utility/cacert.pem',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': '$ConnectionString',
        'sasl.password': connection_string,  # update
        'group.id': group,
        'client.id': 'python-example-consumer',
        # 'request.timeout.ms': 60000,
        'session.timeout.ms': 60000,
        'auto.offset.reset': 'latest',
        'enable.auto.commit': True,
        'api.version.fallback.ms': 0,
        'api.version.request': True,
    }
    # Create logger for consumer (logs will be emitted when poll() is called)
    logger = logging.getLogger('consumer')
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        '%(asctime)-15s %(levelname)-8s %(message)s'))
    logger.addHandler(handler)
    kafka_send(topics[0],servers,connection_string)
    # Create Consumer instance
    # Hint: try debug='fetch' to generate some log messages
    c = Consumer(conf, logger=logger)

    def print_assignment(consumer, partitions):
        print('Assignment:', partitions)

    # Subscribe to topics
    print("subscribing....")
    c.subscribe(topics, on_assign=print_assignment)

    # Read messages from Kafka, print to stdout
    print("start polling....")
    try:
        for i in range(20):
            msg = c.poll(timeout=100.0)
            if msg is None:
                continue
            if msg.error():
                # Error or event
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                else:
                    # Error
                    raise KafkaException(msg.error())
            else:
                # Proper message
                ad=json.loads(msg.value())
                # print(ad)
                with open('Utility/folder/file.json', 'a') as outfile:
                    outfile.write(json.dumps(ad))
                    outfile.write("\n")
                    outfile.close()
                data = pd.read_json('Utility/folder/file.json', lines=True)
                data.to_csv('uploaded_data/file.csv')
                d=pd.read_csv('uploaded_data/file.csv')
                anomaly_df=pd.DataFrame(d)
                anomaly_df=anomaly_df.sort_values(by=['Timestamp'], ascending=True)
                return anomaly_df
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        sys.stderr.write('%% Aborted by user\n')

    finally:
        print("finally")

        # Close down consumer to commit final offsets.
        c.close()
