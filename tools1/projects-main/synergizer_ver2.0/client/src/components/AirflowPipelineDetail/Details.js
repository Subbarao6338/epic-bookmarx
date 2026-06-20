import React, { useEffect, useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getAirflowDagRunTasks } from "../../apis/pipeline/airflow";
import moment from "moment";
import StatusIcon from "../StatusIcon";
import SplitPane from "react-split-pane";
import PipelineFlowGraph from "./PipelineGraph";
import { Box } from "@mui/system";

function Details({
  dag,
  dagRun,
  airflowTaskRuns,
  dbndTaskRuns,
  airflowPipelineTasks,
}) {
  const { dag_id, dag_run_id } = useParams();

  const getTaskRunParams = (task_id) => {
    const task = dbndTaskRuns?.task_runs?.find(({ name }) => name === task_id);
    var task_run_params = [];

    if (task) {
      task_run_params = task.task_run_params;
      task_run_params =
        typeof task.task_run_params === "string" && JSON.parse(task_run_params);
    }
    // console.log(task, task_run_params);
    return task_run_params;
  };

  return (
    <div>
      <SplitPane
        split="vertical"
        minSize={400}
        maxSize={800}
        defaultSize={"50%"}
        style={{
          position: "relative",
        }}
        resizerStyle={{
          backgroundColor: "whitesmoke",
          width: "8px",
          cursor: "col-resize",
          alignItems: "stretch",
        }}
      >
        <div>
          <div>
            <Typography variant="h6" componet={"div"}>
              Pipeline Run Details
            </Typography>
            <table className="table" style={{ maxWidth: 600 }}>
              <tbody>
                <tr>
                  <td>Dag Id</td>
                  <td>{dag_id}</td>
                </tr>
                <tr>
                  <td>Dagrun Id</td>
                  <td>{dag_run_id}</td>
                </tr>
                <tr>
                  <td>Execution Date</td>
                  <td>{moment(dagRun.execution_date).calendar()}</td>
                </tr>
                <tr>
                  <td>Run Duration</td>
                  <td>
                    {moment(dagRun.end_date).diff(dagRun.start_date, "seconds")}{" "}
                    sec
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <Typography variant="h6" componet={"div"}>
              Tasks
            </Typography>
            <Tabs value={0}>
              <Tab label="Children" />
              <Tab label="Upstreams" />
              <Tab label="Downstreams" />
              <Tab label="All Tasks" />
            </Tabs>
            <table className="table" style={{ maxWidth: 600 }}>
              <tbody>
                {airflowTaskRuns?.task_instances?.map((task_run) => (
                  <tr key={task_run.task_id}>
                    <td>
                      <StatusIcon status={task_run.state} fontSize={"small"} />{" "}
                      {task_run.task_id}
                    </td>
                    <td>
                      <div> User Params:</div>
                      {getTaskRunParams(task_run.task_id).map(
                        ({ parameter_name, value }) => (
                          <div key={parameter_name}>
                            <td className="pe-2">{parameter_name}:</td>
                            <td>{value}</td>
                          </div>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <Box sx={{ height: "calc(100vh - 196px)" }}>
            <PipelineFlowGraph
              dag={dag}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
            />
          </Box>
        </div>
      </SplitPane>
    </div>
  );
}

export default Details;
