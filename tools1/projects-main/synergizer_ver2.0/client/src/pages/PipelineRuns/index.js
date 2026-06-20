import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAirflowDagRuns,
  getAirflowDagRunsBatch,
} from "../../apis/pipeline/airflow";
import DataTable from "react-data-table-component";
import moment from "moment";
import StatusIcon from "../../components/StatusIcon";

function PipelineRuns() {
  const { dag_id } = useParams();
  const navigate = useNavigate();
  const [pipelineRuns, setPipelineRuns] = useState({
    dag_runs: [],
    total_entries: 0,
  });
  const [loading, setLoading] = useState({ pipelineRuns: true });

  const handleRowClicked = (row) => {
    navigate(`/pipeline_run/${row.dag_id}/${row.dag_run_id}`);
  };

  useEffect(() => {
    if (dag_id) {
      getAirflowDagRuns(dag_id)
        .then((res) => {
          console.log(res.data);
          setPipelineRuns(res.data);
        })
        .finally(() => {
          setLoading((prevState) => ({ ...prevState, pipelineRuns: false }));
        });
    } else {
      getAirflowDagRunsBatch()
        .then((res) => {
          console.log(res.data);
          setPipelineRuns(res.data);
        })
        .finally(() => {
          setLoading((prevState) => ({ ...prevState, pipelineRuns: false }));
        });
    }
  }, [dag_id]);

  return (
    <div>
      <Typography variant="h5" component={"div"}>
        Pipeline Runs
      </Typography>
      <div className="p-2 bg-light mb-2">
        <Typography mr={2} component={"span"}>
          Pipeline: <b>{dag_id || "All"}</b>
        </Typography>
        <Typography component={"span"}>
          Total Runs: <b>{pipelineRuns.total_entries}</b>
        </Typography>
      </div>
      <Paper>
        <DataTable
          data={pipelineRuns.dag_runs}
          columns={[
            {
              name: "Name",
              selector: (row) => row.dag_id,
              sortField: "dag_id",
              sortable: true,
            },
            {
              name: "Status",
              selector: ({ state }) => state,
              cell: ({ state }) => (
                <span className="pe-none">
                  <StatusIcon fontSize="small" status={state} /> {state}
                </span>
              ),
              sortField: "state",
              sortable: true,
            },
            {
              name: "Run Id",
              selector: (row) => row.dag_run_id,
              sortable: true,
            },
            {
              name: "Execution Date",
              selector: (row) => row.execution_date,
              sortable: true,
            },
            {
              name: "Start Date",
              selector: (row) => row.start_date,
              sortable: true,
            },
            {
              name: "End Date",
              selector: (row) => row.end_date,
              sortable: true,
            },
            {
              name: "Duration",
              selector: (row) => (
                <span>
                  {moment(row.end_date).diff(row.start_date, "seconds")} sec
                </span>
              ),
            },
          ]}
          progressPending={loading.pipelineRuns}
          onRowClicked={handleRowClicked}
          pagination
          paginationTotalRows={pipelineRuns.total_entries}
          highlightOnHover
          pointerOnHover
        />
      </Paper>
    </div>
  );
}

export default PipelineRuns;
