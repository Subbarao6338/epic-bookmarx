import argparse

from confluent_kafka import Consumer, KafkaException, KafkaError
import sys
import getopt
import json
import logging
from pprint import pformat
import pandas as pd
import subprocess


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

def consume_kafka(topics):
    group = '$default'
    #optlist = getopt.getopt(group, 'T:')
    connection_string = "Endpoint=sb://prathamcdpehns.servicebus.windows.net/;" \
                        "SharedAccessKeyName=RootManageSharedAccessKey;" \
                        "SharedAccessKey=s+qCcNwlLHZS1bg9r0AXeCMCvaT8/ruy+E2/LRkk6rs="
    servers = 'prathamcdpehns.servicebus.windows.net:9093'
    # Consumer configuration
    # See https://github.com/edenhill/librdkafka/blob/master/CONFIGURATION.md
    conf = {
        'bootstrap.servers': servers,  # update
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': 'cacert.pem',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': '$ConnectionString',
        'sasl.password': connection_string,  # update
        'group.id': group,
        'client.id': 'python-example-consumer',
        'request.timeout.ms': 60000,
        'session.timeout.ms': 60000,
        'auto.offset.reset': 'latest',
        'enable.auto.commit': True

    }
    logger = logging.getLogger('consumer')
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        '%(asctime)-15s %(levelname)-8s %(message)s'))
    logger.addHandler(handler)

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
        json_array = []
        import time
        timeout = time.time() + 60 * 5  # 5 minutes from now
        while True:
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
                    # print(msg.value())
                    #print(json.loads(msg.value()))
                    print("test")
                    json_array.append(json.loads(msg.value()))
                    print(json_array)
                    if(time.time() > timeout):
                        return json_array
                    #print(json.dumps(json.loads(msg.value())))

                    #anomaly_df = pd.json_normalize(json.loads(msg.value()))
                    #print(anomaly_df)
                    #print(len(anomaly_df))
                    #anomaly_df1 = anomaly_df.infer_objects()
                    #object_list = list(
                    #    anomaly_df1.select_dtypes(include=['object', 'datetime64', 'datetime64[ns]']).columns)
                    #int_list = list(anomaly_df1.select_dtypes(include=['int64', 'float64', 'int32', 'float32']).columns)
                    #print("Pavithran int_list :>>", int_list)
                    #print("Pavithran object_list :>>", object_list)




    except KeyboardInterrupt:
        sys.stderr.write('%% Aborted by user\n')

    finally:
        # Close down consumer to commit final offsets.
        c.close()


# if __name__ == '__main__':
#     array_val = []
#     array_val.append('demo_event_hub')
#     print(array_val)
#     consume_kafka(array_val)
