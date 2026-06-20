"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
emains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

import great_expectations as ge
import great_expectations.jupyter_ux
from great_expectations.core.batch import BatchRequest
from great_expectations.profile.user_configurable_profiler import UserConfigurableProfiler
from great_expectations.checkpoint import SimpleCheckpoint
from great_expectations.exceptions import DataContextError

import json

from matplotlib.font_manager import json_dump
from ge_api.models import ResultV1

from ge_utils.expectation_list import get_expectation_list


def save_execution_result(json_result):
    expectation_list = get_expectation_list()
    dq_map = {expectation['expectation_type']: expectation['dq_dimension']
              for expectation in expectation_list}

    # print(json_result)
    meta = json_result['meta']
    results = json_result['results']

    result_objs = []
    for result in results:
        datasource_name = meta["active_batch_definition"]["datasource_name"]
        dataset_name = meta["active_batch_definition"]["data_asset_name"]
        expectation_suite_name = meta["expectation_suite_name"]
        run_name = meta['run_id']['run_name']
        cde_name = result["expectation_config"]['kwargs'].get('column', 'none')
        expectation_name = result["expectation_config"]["expectation_type"]
        expectation_config = json.dumps(result["expectation_config"])
        dq_dimension = dq_map.get(expectation_name, 'other')
        result_status = result['success']
        result_json = json.dumps(result['result'])
        #
        result_obj = ResultV1(
            datasource_name=datasource_name,
            dataset_name=dataset_name,
            expectation_suite_name=expectation_suite_name,
            run_name=run_name,
            cde_name=cde_name,
            expectation_name=expectation_name,
            expectation_config=expectation_config,
            dq_dimension=dq_dimension,
            result_status=result_status,
            result_json=result_json
        )
        result_objs.append(result_obj)

    ResultV1.objects.bulk_create(result_objs)


def run_validation(context, checkpoint_config, expectation_suite_name):
    checkpoint = SimpleCheckpoint(

        f"_tmp_checkpoint_{expectation_suite_name}",
        context,
        **checkpoint_config

    )
    checkpoint_result = checkpoint.run(result_format='COMPLETE')
    json_result = checkpoint_result.list_validation_results()[0].to_json_dict()
    save_execution_result(json_result)
    return json_result
