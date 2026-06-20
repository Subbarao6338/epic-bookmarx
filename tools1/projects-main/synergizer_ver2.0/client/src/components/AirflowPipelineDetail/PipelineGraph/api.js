import axios from "axios";
import { MarkerType } from "react-flow-renderer";
import { getLayoutedElements } from "./dagreLayout";

function getDagtasks(dag_id) {
  return axios.get(`http://localhost:8000/api/airflow/dags/${dag_id}/tasks`);
}

function getTaskInstances(dag_id, dag_run_id) {
  return axios.get(
    `http://localhost:8000/api/airflow/dags/${dag_id}/dag_runs/${dag_run_id}/task_instances/`
  );
}

function getSubTaskInstances(dag_id, execution_date) {
  return axios.get(
    `http://127.0.0.1:8000/api/v1/airflow/pipelines/dbnd_pipeline_example/execution_date/2022-09-05T10:35:52.057887Z/task_runs/`
  );
}

export async function getPipelineGraph(dag_id, dag_run_id) {
  const execution_date = dag_run_id.split("__").pop();
  const r1 = getDagtasks(dag_id);
  const r2 = getTaskInstances(dag_id, dag_run_id);
  const r3 = getSubTaskInstances(dag_id, execution_date);

  const [v1, v2, v3] = await Promise.all([r1, r2, r3]);
  console.log(v1, v2, v3);

  var nodes = [];
  var edges = [];

  const position = { x: 0, y: 0 };
  const markerEnd = {
    type: MarkerType.Arrow,
  };
  const edgeType = "smaoothstep";

  // add airflow nodes and edges

  v1.data.tasks.forEach((task) => {
    const node = {
      id: task.task_id,
      data: { label: task.task_id },
      position,
    };

    const source_task_id = task.task_id;
    const edgeList = task.downstream_task_ids.map((downstream_task_id) => {
      return {
        id: ["edge", source_task_id, downstream_task_id].join("_"),
        source: source_task_id,
        target: downstream_task_id,
        markerEnd,
        edgeType,
      };
    });

    nodes.push(node);
    edges = edges.concat(edgeList);
  });

  // add dbnd tasks nodes and edges

  // v3.data.task_runs.forEach((value) => {
  //   const node = {
  //     id: value.task_run_uid,
  //     data: { label: value.task_definition_uid.name },
  //     position,
  //   };

  //   const upstreams_map = JSON.parse(value.upstreams_map);
  //   const edgeList = upstreams_map.map(([source, target]) => ({
  //     id: ["edge", target, source].join("_"),
  //     source,
  //     target,
  //     markerEnd,
  //     edgeType,
  //   }));

  //   nodes.push(node);
  //   edges = edges.concat(edgeList);
  // });

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges
  );

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
