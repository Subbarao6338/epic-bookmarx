import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import { SelectTimeRange, timeOptions } from "../../components/SelectTimeRange";

function ADFPipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [timespan, setTimespan] = useState(timeOptions[0].value);
  const [loading, setLoading] = useState(false);

  const handleTimeRangeChange = (e) => {
    setTimespan(JSON.parse(e.target.value));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/adf/pipelines/?timespan=${timespan.from}|${timespan.to}`
      )
      .then((res) => {
        setPipelines(res.data.values);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [timespan]);

  return (
    <div>
      <div className="mt-2 border">
        <div className="d-flex p-2">
          <span>{pipelines.length + " Pipelines"}</span>
          <span className="ms-auto">
            {loading && <span className="k-icon k-i-loading mx-2" />}
            <label className="me-1">Time Range</label>
            <SelectTimeRange onChange={handleTimeRangeChange} />
          </span>
        </div>
        <PipelineTable data={pipelines} />
      </div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
      ></link>
    </div>
  );
}

export default ADFPipelines;

const PipelineTable = ({ data }) => {
  const statusIconMap = {
    Succeeded: <span className="k-icon k-i-check-circle text-success" />,
    Failed: <span className="k-icon k-i-close-circle text-danger" />,
    Queued: <span className="k-icon k-i-clock text-info" />,
    "In progress": <span className="k-icon k-i-loading text-primary" />,
  };

  const columns = [
    {
      name: "Name",
      selector: "pipeline_name",
      sortable: true,
    },
    {
      name: "Run States",
      selector: (row) => row.failed_count,
      cell: (row) => (
        <span>
          {row["failed_count"] > 0 && (
            <span className="me-1">
              {statusIconMap["Failed"]}
              {row["failed_count"]} Failed
            </span>
          )}
          {row["succeeded_count"] > 0 && (
            <span className="me-1">
              {statusIconMap["Succeeded"]}
              {row["succeeded_count"]} Success
            </span>
          )}
          {row["failed_count"] + row["succeeded_count"] === 0 && (
            <span>0 Runs</span>
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Alert Definitions",
      selector: "alert_rules_count",
      cell: (row) => (
        <span>
          <i class="bi bi-bell-fill text-secondary me-2"></i>
          <span>{row.alert_rules_count}</span>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Alerts",
      selector: "alerts_count",
      cell: (row) => (
        <span>
          <i class="bi bi-fire text-danger me-1"></i>
          <span>{row.alerts_count}</span>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Last Run",
      selector: (row) => row.run_history[0]?.run_start || "9999",
      cell: (row) => {
        const last_run = row.run_history[0];
        return last_run ? (
          <span>
            {statusIconMap[last_run.status]}
            {moment(last_run.run_start).calendar()}
          </span>
        ) : (
          <span>No Run</span>
        );
      },
      sortable: true,
    },
  ];
  return <DataTable columns={columns} data={data} pagination dense />;
};
