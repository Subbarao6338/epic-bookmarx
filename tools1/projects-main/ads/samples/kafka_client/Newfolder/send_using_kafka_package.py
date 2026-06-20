import datetime
import json
import random
from confluent_kafka import Producer
import sys

if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.stderr.write('Usage: %s <topic>\n' % sys.argv[0])
        sys.exit(1)
    topic = sys.argv[1]
    

    connection_string = "Endpoint=sb://prathamcdpehns.servicebus.windows.net/;" \
                        "SharedAccessKeyName=RootManageSharedAccessKey;" \
                        "SharedAccessKey=s+qCcNwlLHZS1bg9r0AXeCMCvaT8/ruy+E2/LRkk6rs="
    servers = 'prathamcdpehns.servicebus.windows.net:9093'
    conf = {
        'bootstrap.servers': servers,  # replace
        'security.protocol': 'SASL_SSL',
        'ssl.ca.location': 'cacert.pem',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': '$ConnectionString',
        'sasl.password': connection_string,  # replace
        'client.id': 'python-example-producer'
    }
    p = Producer(**conf)

    def delivery_callback(err, msg):
        if err:
            sys.stderr.write('%% Message failed delivery: %s\n' % err)
        else:
            sys.stderr.write(
                'Message= %s | topic= %s | partition= [%d] | offset= %o\n' % (msg.value(), msg.topic(), msg.partition(), msg.offset()))

    # Write 1-100 to topic
    import time
    for i in range(0, 20):
        try:
            reading = {'DeviceName': 'temp_sensor_kafka_1', 'Timestamp': str(datetime.datetime.utcnow()),
                       'UVValue': random.random(), 'Temperature': random.randint(70, 100),
                       'Humidity': random.randint(70, 100), 'source': 'kafka'}
            # reading = {"message": i}
            event_data = json.dumps(reading)

            p.produce(topic, event_data, callback=delivery_callback)
            time.sleep(2)
        except BufferError as e:
            sys.stderr.write(
                '%% Local producer queue is full (%d messages awaiting delivery): try again\n' % len(p))
        p.poll(0)

    # Wait until all messages have been delivered
    sys.stderr.write('%% Waiting for %d deliveries\n' % len(p))
    p.flush()
