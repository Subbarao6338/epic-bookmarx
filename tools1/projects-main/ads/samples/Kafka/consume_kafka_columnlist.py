import argparse
import send_using_kafka_package as send_kafka
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
    # sys.exit(1)


def print_assignment(consumer, partitions):
    print('Assignment:', partitions)


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
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': True,
        # 'request.timeout.ms': 10000,
        # 'session.timeout.ms': 60000,
        # 'auto_commit_interval_ms' : 1000,
        # 'api.version.fallback.ms': 0,
        # 'api.version.request': False,
        # 'max.poll.interval.ms': 60000,
        # 'max.poll.records': 5,
        # 'fetch.max.wait.ms': 500,
        # 'enable.auto.offset.store':False,

    }
    logger = logging.getLogger('consumer')
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        '%(asctime)-15s %(levelname)-8s %(message)s'))
    logger.addHandler(handler)
    response1 = send_kafka.kafka_send('demo_event_hub')
    print(response1)
    # Create Consumer instance
    # Hint: try debug='fetch' to generate some log messages
    c = Consumer(conf, logger=logger)



    # Subscribe to topics
    print("subscribing....")
    c.subscribe(topics, on_assign=print_assignment)

    # Read messages from Kafka, print to stdout
    print("start polling....")
    for i in range(0, 15):
        try:
            while True:
                msg = c.poll(20)

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
                    # print(json.loads(msg.value()))
                    # print(json.dumps(json.loads(msg.value())))

                    anomaly_df = pd.json_normalize(json.loads(msg.value()))
                    # anomaly_df=pd.DataFrame(msg.value())
                    # df = pd.DataFrame([])
                    # # df_dictionary = pd.DataFrame([dictionary])
                    # output = pd.concat([df, anomaly_df], ignore_index=True)
                    # print(output)
                    # print(anomaly_df)
                    # print(len(anomaly_df))
                    # anomaly_df1 = anomaly_df.infer_objects()
                    # object_list = list(
                    #     anomaly_df1.select_dtypes(include=['object', 'datetime64', 'datetime64[ns]']).columns)
                    # int_list = list(anomaly_df1.select_dtypes(include=['int64', 'float64', 'int32', 'float32']).columns)
                    # print("Pavithran int_list :>>", int_list)
                    # print("Pavithran object_list :>>", object_list)
                    # json_object = {}
                    # json_object['int_list'] = int_list
                    # json_object['object_list'] = object_list
                    # print(json_object)
                    # return anomaly_df
            time.sleep(2)
        except KeyboardInterrupt:
            print("KeyboardInterrupt")
            sys.stderr.write('%% Aborted by user\n')

        finally:
            print("finally")
            # Close down consumer to commit final offsets.
            c.close()


# if __name__ == '__main__':
#     array_val = []
#     array_val.append('demo_event_hub')
#     print(array_val)
#     consume_kafka(array_val)
