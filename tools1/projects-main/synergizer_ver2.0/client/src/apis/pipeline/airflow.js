import axios from "axios";
import config from "../../config";

// pipeline
export function getAirflowPipelines() {
  const endPoint = "/airflow/dags/";
  return axios(config.synergizer_api_url + endPoint);
}

export function getAirflowPipeline(dag_id) {
  const endPoint = `/airflow/dags/${dag_id}`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getAirflowPipelineTasks(dag_id) {
  const endPoint = `/airflow/dags/${dag_id}/tasks`;
  return axios.get(config.synergizer_api_url + endPoint);
}

// metrics
export function getAirflowMetrics() {
  const endPoint = "/airflow/metrics_v2/";
  return axios(config.synergizer_api_url + endPoint);
}

// pipeline runs
export function getAirflowDagRunsBatch() {
  const endPoint = `/airflow/dag_runs/`;
  return axios(config.synergizer_api_url + endPoint);
}

export function getAirflowDagRuns(dag_id) {
  const endPoint = `/airflow/dag_runs/${dag_id}/`;
  return axios(config.synergizer_api_url + endPoint);
}

export function getDagRun(dag_id, dag_run_id) {
  const endPoint = `/airflow/dags/${dag_id}/dagRuns/${dag_run_id}`;
  return axios(config.synergizer_api_url + endPoint);
}

// taks runs & logs

export function getTaskInstances(dag_id, dag_run_id) {
  const endPoint = `/airflow/dags/${dag_id}/dag_runs/${dag_run_id}/task_instances/`;
  return axios(config.synergizer_api_url + endPoint);
}

export function getAirflowDagRunTasks(dag_id, dag_run_id) {
  const endPoint = `/airflow/dags/${dag_id}/dag_runs/${dag_run_id}/task_instances/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getAirflowTaskRunLog(dag_id, dag_run_id, task_id, try_number) {
  const endPoint = `/airflow/dags/${dag_id}/dagRuns/${dag_run_id}/taskInstances/${task_id}/logs/${try_number}/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

// DBND

export function getDbndPipelineRun(dag_id, dag_run_id) {
  const execution_date = dag_run_id.split("__").pop();
  const endPoint = `/v1/airflow/pipelines/${dag_id}/execution_date/${execution_date}/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getDbndPipelineTaskRuns(dag_id, dag_run_id) {
  const execution_date = dag_run_id.split("__").pop();
  const endPoint = `/v1/airflow/pipelines/${dag_id}/execution_date/${execution_date}/task_runs/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getDbndTaskRunMetrics(task_run_uid, task_run_attempt_uid) {
  const endPoint = `/v1/airflow/task_runs/${task_run_uid}/task_run_attempts/${task_run_attempt_uid}/metrics/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getDbndTaskRunLog(task_run_uid, task_run_attempt_uid) {
  const endPoint = `/v1/airflow/task_runs/${task_run_uid}/task_run_attempts/${task_run_attempt_uid}/logs/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getdbndTaskDefinition(task_definition_uid) {
  const endPoint = `/v1/airflow/task_definition/${task_definition_uid}`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getdbndDatasetLogs(pipeline_run_uid) {
  const endPoint = `/v1/airflow/pipeline_runs/${pipeline_run_uid}/dataset_logs/`;
  return axios.get(config.synergizer_api_url + endPoint);
}

export function getdbndDatasetOperations(task_run_name, operation_path) {
  const endPoint = `/v1/airflow/dataset_operations/?task_run_name=${task_run_name}&operation_path=${operation_path}`;
  return axios.get(config.synergizer_api_url + endPoint);
}
