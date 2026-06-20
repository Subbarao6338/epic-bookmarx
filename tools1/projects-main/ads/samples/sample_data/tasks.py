import json
from celery import shared_task
import pandas as pd
from great_expectations.core.batch import RuntimeBatchRequest
from .data_context import create_context
from db_utils.ge_operations import db_insert_stream_validation
import time
from confluent_kafka import Consumer


class KafkaConsumerClass:
    flag = True

    def __init__(self, kafka_config, topics) -> None:
        self.kafka_cofig = kafka_config
        self.topics = topics
        self.kafka_consumer = self._initialize_kafka_consumer()

    def _initialize_kafka_consumer(self):
        kafka_consumer = Consumer(self.kafka_cofig)
        kafka_consumer.subscribe(self.topics)
        return kafka_consumer

    def _handle_consumer_error(self, error):
        print("kafka consumer error", error)

    def _deserializer(self, data):
        return json.loads(data.decode('utf-8'))

    def start_kafka_consumer(self, time_limit=15):
        start_time = time.time()
        end_time = start_time + time_limit
        message_queue = []
        while self.flag and (time.time() <= end_time):
            msg = self.kafka_consumer.poll(2)
            if msg is None:
                print("No message!")
                continue
            if msg.error():
                self._handle_consumer_error(msg.error())
                continue
            message = self._deserializer(msg.value())
            print(message)
            message_queue.append(message)

        self.kafka_consumer.close()
        return message_queue

    def close_kafka_consumer(self):
        self.flag = False


@shared_task(bind=True)
def validation_task(
    self,
    checkpoint_name,
    datasource_name,
    expectation_suite_name,
    kafka_config,
    kafka_topics
):
    context = create_context()
    kafka_consumer = KafkaConsumerClass(
        kafka_config=kafka_config, topics=kafka_topics)
    kafka_data = kafka_consumer.start_kafka_consumer(time_limit=15)
    df = pd.DataFrame(kafka_data)
    batch_request = RuntimeBatchRequest(
        datasource_name=datasource_name,
        data_connector_name="default_runtime_data_connector_name",
        data_asset_name="stream datasource",
        runtime_parameters={"batch_data": df},
        batch_identifiers={"default_identifier_name": "default_identifier"}
    )
    try:
        context.get_expectation_suite(
            expectation_suite_name=expectation_suite_name)
    except:
        context.create_expectation_suite(
            expectation_suite_name=expectation_suite_name)

    validator = context.get_validator(
        batch_request=batch_request, expectation_suite_name=expectation_suite_name)

    result = validator.validate()
    element_count = len(kafka_data)
    unexpected_count = 0
    for each_result in result.results:
        unexpected_count += each_result['result'].get('unexpected_count', 0)
    complete_result = result.to_json_dict()
    db_insert_stream_validation(
        checkpoint_name=checkpoint_name, element_count=element_count, unexpected_count=unexpected_count, value=json.dumps(complete_result))
    print(f"Rows processed: {element_count} | rows failed:{unexpected_count}")
