import React, { useCallback, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import Details from "./Details";
import Metrics from "./Metrics";
import Logs from "./Logs";
import SourceCode from "./SourceCode";
import RunHistory from "./RunHistory";
import AffectedDataset from "./AffectedDataset";
import Histogram from "./Histogram";
import axios from "axios";
import config from "../../config";
import { Typography } from "@mui/material";
import {
  getAirflowDagRunTasks,
  getAirflowPipeline,
  getAirflowPipelineTasks,
  getDagRun,
  getDbndPipelineRun,
  getDbndPipelineTaskRuns,
} from "../../apis/pipeline/airflow";

function AirflowPipelineRun() {
  const { dag_id, dag_run_id } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(hash?.slice(1) || undefined);
  const [dagDetail, setDagDetail] = useState({});
  const [airflowPipelineTasks, setAirflowPipelineTasks] = useState({});
  const [dagRun, setDagRun] = useState({});
  const [airflowTaskRuns, setAirflowTaskRuns] = useState({});
  const [dbndTaskRuns, setDbndTaskRuns] = useState({});

  const handleTabChange = (k) => {
    setSelectedTab(k);
    navigate("#" + k);
  };

  useEffect(() => {
    getAirflowPipeline(dag_id).then((res) => {
      console.log(res.data);
      setDagDetail(res.data);
    });

    getDagRun(dag_id, dag_run_id).then((res) => {
      console.log(res.data);
      setDagRun(res.data);
    });

    getAirflowPipelineTasks(dag_id).then((res) => {
      console.log(res.data);
      setAirflowPipelineTasks(res.data);
    });

    getAirflowDagRunTasks(dag_id, dag_run_id).then((res) => {
      console.log(res.data);
      setAirflowTaskRuns(res.data);
    });

    getDbndPipelineTaskRuns(dag_id, dag_run_id).then((res) => {
      console.log(res.data);
      setDbndTaskRuns(res.data);
    });
  }, [dag_id, dag_run_id]);

  return (
    <div>
      <div className="p-2 mb-2 bg-light">
        <Typography component={"span"} mr={2}>
          Pipeline: <b>{dag_id}</b>
        </Typography>
        <Typography component={"span"}>
          Dagrun Id: <b>{dag_run_id}</b>
        </Typography>
      </div>
      <div>
        <Tabs
          className="bg-light mb-2"
          activeKey={selectedTab}
          onSelect={handleTabChange}
          mountOnEnter={true}
        >
          <Tab title="Details" eventKey="details">
            <Details
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Metrics" eventKey="metrics">
            <Metrics
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Logs" eventKey="logs">
            <Logs
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Code" eventKey="code">
            <SourceCode
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Run Info" eventKey="run_info">
            <RunHistory
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Affected Datasets" eventKey="affected_dataset">
            <AffectedDataset
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
          <Tab title="Histograms" eventKey="histogram">
            <Histogram
              dag={dagDetail}
              dagRun={dagRun}
              airflowPipelineTasks={airflowPipelineTasks}
              airflowTaskRuns={airflowTaskRuns}
              dbndTaskRuns={dbndTaskRuns}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default AirflowPipelineRun;
