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

function AirflowPipeline() {
  const { dag_id } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(hash?.slice(1) || undefined);
  const [dagDetail, setDagDetail] = useState({});

  const getDagDetail = useCallback(() => {
    axios
      .get(config.synergizer_api_url + "/airflow/dags/" + dag_id)
      .then((res) => {
        // console.log(res.data);
        setDagDetail(res.data);
      })
      .catch((err) => {
        console.err(err);
      });
  }, [dag_id]);

  const handleTabChange = (k) => {
    setSelectedTab(k);
    navigate("#" + k);
  };

  useEffect(() => {
    getDagDetail();
  }, [getDagDetail]);

  return (
    <div>
      <div className="mb-2">
        <label>Pipeline: &nbsp; </label>
        <b>{dag_id}</b>
      </div>
      <div>
        <Tabs
          className="bg-light"
          activeKey={selectedTab}
          onSelect={handleTabChange}
          mountOnEnter={true}
        >
          <Tab title="Details" eventKey="details">
            <Details />
          </Tab>
          <Tab title="Metrics" eventKey="metrics">
            <Metrics />
          </Tab>
          <Tab title="Logs" eventKey="logs">
            <Logs dag={dagDetail} />
          </Tab>
          <Tab title="Code" eventKey="code">
            <SourceCode dag={dagDetail} />
          </Tab>
          <Tab title="Run Info" eventKey="run_info">
            <RunHistory />
          </Tab>
          <Tab title="Affected Datasets" eventKey="affected_dataset">
            <AffectedDataset />
          </Tab>
          <Tab title="Histograms" eventKey="histogram">
            <Histogram />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default AirflowPipeline;
