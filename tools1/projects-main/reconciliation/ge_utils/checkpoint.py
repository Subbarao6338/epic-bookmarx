
import json
from great_expectations.data_context.data_context import DataContext
from ge_utils.validation import save_execution_result
from db_utils.checkpoint import db_get_checkpoints
from db_utils.validation import db_delete_validation_on_checkpoint_delete
from ge_api.models import Report, ResultV1

def list_checkpoints():
    return db_get_checkpoints()


def create_checkpoint(context: DataContext, checkpoint_config):
    context.add_checkpoint(**checkpoint_config)
    return list_checkpoints()


def run_checkpoint(context: DataContext, checkpoint_name):
    result = context.run_checkpoint(
        checkpoint_name=checkpoint_name, result_format="COMPLETE")
    json_result = result.list_validation_results()[0].to_json_dict()
    save_execution_result(json_result)
    return json_result


def delete_checkpoint(context: DataContext, checkpoint_name):
    context.delete_checkpoint(name=checkpoint_name)
    run_name_ls = db_delete_validation_on_checkpoint_delete(checkpoint_name)
    Report.objects.filter(checkpoint_name=checkpoint_name).delete()
    for rn in run_name_ls:
        ResultV1.objects.filter(run_name=rn).delete()
        
    return list_checkpoints()
