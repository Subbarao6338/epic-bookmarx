import sys
#import Kafka.consume_kafka as consume_kafka
# import consume_kafka_columnlist as consume_kafka
import consume_using_kafka_package as consume_kafka


if __name__ == '__main__':
    array_val = []
    array_val.append('demo_event_hub')
    print(array_val)
    response = consume_kafka.consume_kafka(array_val)
    print(response)
    #consume_kafka_columnlist.consume_kafka(array_val)


# def check_process():
#     import subprocess
#     script_name = "consume_using_kafka_package.py '$default' demo_event_hub"
#     cmd='pgrep -f .*python.*{}'.format(script_name)
#     process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#     my_pid, err = process.communicate()
#     if len(my_pid.splitlines()) >0:
#         print("Script Running in background")
#
# from asyncio import subprocess
#
#
# def run():
#     args = ['python','-u','consume_using_kafka_package.py','$default','demo_event_hub']
#     popen = subprocess.Popen(args,shell=False,stdout=subprocess.PIPE)
#     #while not can_break:
#     sys.stdout.write(popen.stdout.read(1))
#
# run()