import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "react-flow-renderer";
import { useParams } from "react-router-dom";
import { getLayoutedElements } from "./dagreLayout";

export async function getPipelineGraph(airflowPipelineTasks) {
  var nodes = [];
  var edges = [];

  const position = { x: 0, y: 0 };
  const markerEnd = {
    type: MarkerType.Arrow,
  };
  const edgeType = "smaoothstep";

  // add airflow nodes and edges

  airflowPipelineTasks.tasks.forEach((task) => {
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

function PipelineFlowGraph({ airflowPipelineTasks }) {
  const { dag_id, dag_run_id } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    airflowPipelineTasks.tasks &&
      getPipelineGraph(airflowPipelineTasks)
        .then(({ nodes, edges }) => {
          console.log(nodes, edges);
          setNodes(nodes);
          setEdges(edges);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [airflowPipelineTasks]);

  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "120px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
}

export default PipelineFlowGraph;
