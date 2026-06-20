import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "../../config";
import DataTable from "react-data-table-component";
import * as dfd from "danfojs";
import moment from "moment";

const StatusIcon = ({ status }) => {
  return (
    <>
      {status === "success" && (
        <span className="k-icon k-i-check-circle text-success" />
      )}
      {status === "failed" && (
        <span className="k-icon k-i-close-circle text-danger" />
      )}
    </>
  );
};

function AirflowPipelines() {
  const [pipelineSummary, setPipelineSummary] = useState({
    pipelinesCount: 0,
    pipelinesList: [],
  });

  const fetchAirflowPipelinesSummary = () => {
    var dag_list = axios.get(config.synergizer_api_url + "/airflow/dags/");
    var metrics = axios.get(config.synergizer_api_url + "/airflow/metrics/");
    Promise.all([dag_list, metrics])
      .then(([dag_list, metrics]) => {
        var df1 = new dfd.DataFrame(dag_list.data.dags);
        var df2 = new dfd.DataFrame(metrics.data);
        var merged = dfd
          .merge({
            left: df1,
            right: df2,
            on: ["dag_id"],
            how: "left",
          })
          .fillNa(0);
        setPipelineSummary({
          pipelinesCount: dag_list.data.total_entries,
          pipelinesList: dfd.toJSON(merged),
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchAirflowPipelinesSummary();
  }, []);

  const columns = [
    {
      name: "Pipeline Name",
      selector: "dag_id",
      sortable: true,
    },
    {
      name: "Run States",
      selector: "failed_count",
      cell: ({ failed_count, success_count }) => {
        return (
          <span>
            {failed_count > 0 && (
              <span className="me-1">
                <StatusIcon status="failed" />
                {failed_count + " Failed"}
              </span>
            )}
            {success_count > 0 && (
              <span className="me-1">
                <StatusIcon status="success" />
                {success_count + " Success"}
              </span>
            )}
            {success_count + failed_count === 0 && <span>0 Runs </span>}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Alert Definitions",
      selector: "dag_id",
      cell: () => (
        <span>
          <i class="bi bi-bell-fill text-secondary me-2"></i>
          <span>1</span>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Alerts",
      selector: "failed_count",
      cell: ({ failed_count }) => (
        <span>
          <i class="bi bi-fire text-danger me-1"></i>
          <span>{failed_count}</span>
        </span>
      ),
      sortable: true,
    },
    {
      name: "Last Run",
      selector: "",
      cell: () => (
        <span>
          <StatusIcon status="success" />
          {moment().subtract(1, "hour").calendar()}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="border">
      <div className="p-2">
        <span>{pipelineSummary.pipelinesCount} Pipelines</span>
      </div>
      <DataTable
        columns={columns}
        data={pipelineSummary.pipelinesList}
        pagination
        dense
      />
    </div>
  );
}

export default AirflowPipelines;
