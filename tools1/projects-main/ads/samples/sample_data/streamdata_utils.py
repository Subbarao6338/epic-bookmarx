import json
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from db_utils.db_connection import connect_sql
from db_utils.ge_operations import db_create_stream_checkpoint, db_update_stream_checkpoint_status


def start_validation_task(checkpoint_name):

    engine = connect_sql()
    query1 = """SELECT datasource_name,expectation_suite_name 
    FROM stream_checkpoints 
    WHERE checkpoint_name=?"""
    (datasource_name, expectation_suite_name) = engine.execute(
        query1, checkpoint_name).fetchone()

    query2 = """SELECT json as json_detail
    FROM ge_datasources_store 
    WHERE datasource_name=?"""
    result = engine.execute(query2, datasource_name).fetchone()
    json_detail = json.loads(dict(result).get('json_detail', ''))
    topics = [json_detail['topics']]
    kafka_config = {
        'bootstrap.servers': json_detail['servers'],
        'security.protocol': 'SASL_SSL',
        # 'ssl.ca.location': 'cacert.pem',
        'sasl.mechanism': 'PLAIN',
        'sasl.username': '$ConnectionString',
        'sasl.password': json_detail['conn_str'],
        'group.id': json_detail['group_id'],
        'client.id': 'python-example-consumer',
        'request.timeout.ms': 60000,
        'session.timeout.ms': 60000,
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': True
    }

    schedule, created = IntervalSchedule.objects.get_or_create(
        every=30,
        period=IntervalSchedule.SECONDS,
    )

    periodic_task = PeriodicTask.objects.create(
        interval=schedule,
        name=checkpoint_name,
        task='ge_utils.tasks.validation_task',
        # args=json.dumps(['arg1', 'arg2']),
        kwargs=json.dumps({
            'checkpoint_name': checkpoint_name,
            'datasource_name': datasource_name,
            'expectation_suite_name': expectation_suite_name,
            'kafka_config': kafka_config,
            'kafka_topics': topics
        }),
        # expires=datetime.utcnow() + timedelta(seconds=30)
    )
    db_update_stream_checkpoint_status(
        status=True, checkpoint_name=checkpoint_name)
    return periodic_task.name


def stop_validation_task(checkpoint_name):
    PeriodicTask.objects.filter(name=checkpoint_name).delete()
    db_update_stream_checkpoint_status(
        status=False, checkpoint_name=checkpoint_name)
    return True
