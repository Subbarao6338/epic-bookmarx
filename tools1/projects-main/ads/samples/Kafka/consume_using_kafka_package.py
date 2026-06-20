from confluent_kafka import Consumer, KafkaException, KafkaError
import sys
import getopt
import json
import logging
from pprint import pformat
import pandas as pd
import send_using_kafka_package as send_kafka


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


def dicw(d,x):
    dict.update({k:v for k, v in x.items() if k not in d})

def consume_kafka(topics):
    # optlist, argv = getopt.getopt(sys.argv[1:], 'T:')
    # if len(argv) < 2:
    #     print_usage_and_exit(sys.argv[0])
    #
    # group = argv[0]
    # topics = argv[1:]
    #
    # print(argv[0])
    # print(argv[1:])
    # print(argv[1])
    group = '$default'
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
        # 'request.timeout.ms': 60000,
        'session.timeout.ms': 60000,
        'auto.offset.reset': 'latest',
        'enable.auto.commit': True,
        'api.version.fallback.ms': 0,
        'api.version.request': True,
    }

    # Check to see if -T option exists
    # for opt in optlist:
    #     if opt[0] != 100.0:
    #         continue
    #     try:
    #         intval = int(opt[1])
    #     except ValueError:
    #         sys.stderr.write("Invalid option value for -T: %s\n" % opt[1])
    #         sys.exit(1)
    #
    #     if intval <= 0:
    #         sys.stderr.write(
    #             "-T option value needs to be larger than zero: %s\n" % opt[1])
    #         sys.exit(1)
    #
    #     conf['stats_cb'] = stats_cb
    #     conf['statistics.interval.ms'] = int(opt[1])

    # Create logger for consumer (logs will be emitted when poll() is called)
    logger = logging.getLogger('consumer')
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        '%(asctime)-15s %(levelname)-8s %(message)s'))
    logger.addHandler(handler)
    send_kafka.kafka_send('demo_event_hub')
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
    dic=[]
    try:
        i=0
        while i<5:
            msg = c.poll(10)
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
                i += 1
                ad = json.loads(msg.value())
                dic.append(ad)
                # Proper message
                #print(msg.value())
                # print(json.loads(msg.value()))
                # print(json.dumps(json.loads(msg.value())))
                # ad=json.dumps(json.loads(msg.value()))
                # print(json.dumps(ad))
                # anomaly_df = pd.json_normalize(json.loads(msg.value()))
                # print(anomaly_df)
                # anomaly_df1 = anomaly_df.infer_objects()
                # object_list = list(
                # anomaly_df1.select_dtypes(include=['object', 'datetime64', 'datetime64[ns]']).columns)
                # int_list = list(anomaly_df1.select_dtypes(include=['int64', 'float64', 'int32', 'float32']).columns)
                # print("int_list :>>",int_list)
                # print("object_list :>>", object_list)
                # dic=dic.append(ad)
                # print("dddddddddddd",d1)

                # with open('file.json', 'a') as outfile:
                #     outfile.write(ad)
                #     outfile.write("\n")
                #     outfile.close()
                # data = pd.read_json('file.json', lines=True)
                # data.to_csv('file.csv')
                # d=pd.read_csv('file.csv')
            df1=pd.DataFrame(dic)
                # return df
            df = pd.DataFrame.append(df1,other=df1)
            return df
    except KeyboardInterrupt:
        print("KeyboardInterrupt")
        sys.stderr.write('%% Aborted by user\n')

    finally:
        print("finally")

        # Close down consumer to commit final offsets.
        c.close()
