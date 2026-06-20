from tabnanny import check
from great_expectations.data_context.data_context import DataContext
from great_expectations.core.expectation_configuration import ExpectationConfiguration
from db_utils.expectation import get_expectation_suite_list
from db_utils.checkpoint import db_delete_checkpoint_on_suite_delete
from db_utils.validation import db_delete_validation_on_suite_delete
from ge_api.models import ResultV1, Report


def list_expectation_suites(context: DataContext):
    suite_list = get_expectation_suite_list()
    # return context.list_expectation_suite_names()
    return suite_list


def create_expectation_suite(context: DataContext, suite_config):
    suite_name = suite_config['expectation_suite_name']
    expectations = suite_config['expectations']
    suite = context.create_expectation_suite(
        suite_name, overwrite_existing=True)
    for expectation in expectations:
        expectation_config = ExpectationConfiguration(**expectation)
        suite.add_expectation(expectation_config)
    context.save_expectation_suite(suite, suite_name)
    return "created"


def edit_expectation_suite(context: DataContext, suite_config):
    suite_name = suite_config['expectation_suite_name']
    expectations = suite_config['expectations']
    suite = context.get_expectation_suite(suite_name)
    for expectation in expectations:
        expectation_config = ExpectationConfiguration(**expectation)
        suite.add_expectation(expectation_config)
    context.save_expectation_suite(suite, suite_name)
    return get_expectation_suite_list()


def delete_expectation_suite(context: DataContext, suite_name):
    context.delete_expectation_suite(expectation_suite_name=suite_name)
    db_delete_checkpoint_on_suite_delete(suite_name)
    db_delete_validation_on_suite_delete(suite_name)
    ResultV1.objects.filter(expectation_suite_name=suite_name).delete()
    Report.objects.filter(rule_name=suite_name).delete()
    return get_expectation_suite_list()
