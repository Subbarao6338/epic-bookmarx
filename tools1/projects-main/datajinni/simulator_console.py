import re
from Simulator import device_events_simulator as event_simulator
from Utility import connect_azure_sql as azure_sql_conn
from Utility import connect_sqlite as dbconn
from tabulate import tabulate
from SDV import sdv_main as sdv_simulator

telemetry_data_type_list = ['Rule_Based', 'Deep_Learning']
simulator_type_list = ['event_hub', 'iot_hub']
rerun_stop_list = ['Re-run', 'Exit']
data_options_list = ['telemetry', 'anomaly']
pat = re.compile(r"[0-9]")
simulator_start_stop_list = ['Start', 'Stop']



class color:
   PURPLE = '\033[95m'
   CYAN = '\033[96m'
   DARKCYAN = '\033[36m'
   BLUE = '\033[94m'
   GREEN = '\033[92m'
   YELLOW = '\033[93m'
   RED = '\033[91m'
   BOLD = '\033[1m'
   UNDERLINE = '\033[4m'
   END = '\033[0m'


def index_in_list(list_val, index_val):
    return index_val < len(list_val)


def view_formatter(list_val):
    index_num = 0
    final_view = ""
    for i in list_val:
        index_num = index_num + 1
        view_formatter = str(index_num) + "." + i + "\n"
        final_view = final_view + view_formatter
    return final_view


def check_input_valid(list_val, input_val):
    if re.fullmatch(pat, input_val):
        index_simulator_option = int(input_val)-1
        if index_in_list(list_val, index_simulator_option):
            selected_value = list_val[index_simulator_option]
            # print(color.GREEN + 'Now we selected option is ' + '\033[1m' + selected_value + color.END)
            return selected_value
        else:
            # print(color.RED + "Entered simulator option is not available. Please enter available option." + color.END)
            chk_rerun_stop()
    else:
        # print(color.RED + "Entered simulator option is invalid format. Please enter numbers only (like 1)." + color.END)
        chk_rerun_stop()


def check_textfield_valid(input_val, device_count_metadata):
    try:
        val = int(input_val)
        if device_count_metadata != "":
            if val > int(device_count_metadata):
                # print(color.RED + "Maximum Device Count is "+device_count_metadata+". Please enter less than " + device_count_metadata+"." + color.END)
                chk_rerun_stop()
            else:
                return val
        else:
            return val
    except ValueError:
        # print(color.RED + "Entered simulator option is invalid format. Please enter numbers only (like 1)." + color.END)
        chk_rerun_stop()


def chk_rerun_stop():
    view_val = view_formatter(rerun_stop_list)
    input_rerun_stop = input(view_val +"\nEnter input for exection: ")
    status = check_input_valid(rerun_stop_list, input_rerun_stop)
    if status == "Re-run":
        main()
    else:
        exit()


def update_device_count():
    dbconn.create_device_count_tbl()
    count_metadata = azure_sql_conn.get_device_count_from_metadata()
    count_local = dbconn.get_device_count()
    if count_local != 0:
        if count_local != count_metadata:
            dbconn.update_devicecount(count_metadata)
    else:
        dbconn.insert_devicecount(count_metadata)


def get_device_count():
    final_count = dbconn.get_device_count()
    return final_count


def main():
    update_device_count()
    # print('\n Available Simulator Option')
    telemetry_data_type = view_formatter(telemetry_data_type_list)
    input_telemetry_data_type = input(telemetry_data_type + "\nEnter your Telemetry Data Type: ")
    telemetry_data_type = check_input_valid(telemetry_data_type_list, input_telemetry_data_type)

    view_simulator_type = view_formatter(simulator_type_list)
    input_simulator_type = input(view_simulator_type + "\nEnter your Simulator Type: ")
    simulator_type = check_input_valid(simulator_type_list, input_simulator_type)
    #if input_option == "Event Hub":

    view_data_options = view_formatter(data_options_list)
    input_data_options = input(view_data_options + "\nEnter the Data Options: ")
    data_options = check_input_valid(data_options_list, input_data_options)

    hub_names_list = azure_sql_conn.get_hub_name_details(simulator_type)
    view_hub_names = view_formatter(hub_names_list)
    input_hub_names = input(view_hub_names + "\nEnter the Hub Names: ")
    hub_name = check_input_valid(hub_names_list, input_hub_names)

    device_count_metadata = get_device_count()
    input_device_count = input("\nEnter the Device Count: ")
    device_count = check_textfield_valid(input_device_count, device_count_metadata)

    input_time_delay = input("\nEnter the Time Delay: ")
    time_delay = check_textfield_valid(input_time_delay, "")

    simulator_status = 'Active'

    # print('\n')
    # print(tabulate([
    #     ['Telemetry Data Type', telemetry_data_type_list],
    #     ['Simulator Type', simulator_type],
    #     ['Data Options', data_options],
    #     ['Hub Name', hub_name],
    #     ['Device Count', device_count],
    #     ['Time Delay', time_delay],
    #     ['Simulator Status', simulator_status]
    # ], headers=['Parameters', 'Values']))
    # print('\n')
    #print('Seleted Details given below:')
    #print('----------------------------')
    #print('simulator_type :>>', simulator_type)
    #print('data-options :>>',data_options)
    #print('hub_name :>>', hub_name)
    #print('device count :>>', device_count)
    #print('time_delay :>>', time_delay)
    #print('simulator_status :>>', simulator_status)


    view_sim_start_stop = view_formatter(simulator_start_stop_list)
    input_sim_start_stop = input(view_sim_start_stop + "\nEnter the data options: ")
    sim_start_stop = check_input_valid(simulator_start_stop_list, input_sim_start_stop)

    if sim_start_stop == 'Start':
        if telemetry_data_type == "Rule_Based":
            event_simulator.simulator(simulator_type, data_options, device_count, time_delay, simulator_status, hub_name, "CONSOLE")
        else:
            sdv_simulator.sent_synthetic_data(simulator_type, time_delay, hub_name)

    else:
        exit()
        #EventHubSimulator.main()
    #else:
    #    print(color.RED + "Simulator development is in-progress. Please select Event Hub only." + color.END)
    #   chk_rerun_stop()

if __name__ == '__main__':
    main()
