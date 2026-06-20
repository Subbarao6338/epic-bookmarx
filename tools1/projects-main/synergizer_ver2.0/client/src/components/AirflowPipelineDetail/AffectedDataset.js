import React, { useEffect, useState } from "react";
import {
  getdbndDatasetLogs,
  getdbndDatasetOperations,
} from "../../apis/pipeline/airflow";
import moment from "moment";
import DataTable from "react-data-table-component";
import { Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Box } from "@mui/system";

function AffectedDataset({ dbndTaskRuns }) {
  const [dbndDatasetLogs, setDbndDatasetLogs] = useState();
  const [selectedDataset, setSelectedDataset] = useState();
  const [dbndDatasetOperatios, setDbndDatasetOperations] = useState();

  const loadDbndDatasetOPerations = (task_run_name, operation_path) => {
    getdbndDatasetOperations(task_run_name, operation_path)
      .then((res) => {
        // console.log(res.data);
        setDbndDatasetOperations(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (dbndTaskRuns?.task_runs?.[0]) {
      const pipeline_run_uid = dbndTaskRuns.task_runs[0].pipeline_run;
      getdbndDatasetLogs(pipeline_run_uid)
        .then((res) => {
          setDbndDatasetLogs(res.data);
          if (res.data.dataset_logs.length > 0) {
            setSelectedDataset(res.data.dataset_logs[0]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dbndTaskRuns]);

  useEffect(() => {
    if (selectedDataset) {
      const { task_run_name, operation_path } = selectedDataset;
      loadDbndDatasetOPerations(task_run_name, operation_path);
    }
  }, [selectedDataset]);

  return (
    <div>
      <div>
        {selectedDataset && (
          <Box mb={2}>
            <span style={{ marginRight: 16 }}>
              Task Info: <b>{selectedDataset.task_run_name}</b>
            </span>
            <span>
              Dataset: <b>{selectedDataset.operation_path}</b>
            </span>
          </Box>
        )}
        {dbndDatasetOperatios?.dataset_logs ? (
          <LineChart
            width={600}
            height={300}
            data={dbndDatasetOperatios.dataset_logs.map((dataset) => ({
              timestamp: moment(dataset.timestamp).valueOf(),
              read_value:
                dataset.operation_type === "read"
                  ? JSON.parse(dataset.data_dimensions)[0]
                  : 0,
              write_value:
                dataset.operation_type === "write"
                  ? JSON.parse(dataset.data_dimensions)[0]
                  : 0,
            }))}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
            is
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              scale={"time"}
              tickFormatter={(timeStr) => moment(timeStr).format("HH:mm Do")}
              label={{
                value: "Timestamp",
                position: "insideBottom",
              }}
            />
            <YAxis
              label={{
                value: "Rows Affected",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="read_value"
              stroke="#8884d8"
              name="Read"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="write_value"
              stroke="#F57328"
              name="Write"
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <div>Graph Loading...</div>
        )}
      </div>
      <Paper sx={{ overflow: "hidden" }} variant="outlined">
        <DataTable
          pagination
          progressPending={!dbndDatasetLogs?.dataset_logs}
          data={dbndDatasetLogs?.dataset_logs}
          columns={[
            {
              name: "Time",
              selector: (row) => moment(row.timestamp).calendar(),
            },
            {
              name: "Type",
              selector: (row) => row.operation_path.split("://")[0],
            },
            {
              name: "Table Name",
              selector: (row) => row.operation_path,
            },
            {
              name: "Insights",
              selector: (row) =>
                row.operation_status === "OK" ? "Completed" : "Error",
            },
            {
              name: "Type",
              selector: (row) => row.operation_type,
            },
            {
              name: "Schema",
              selector: (row) => (
                <span>{JSON.parse(row.data_dimensions)[1]} Columns</span>
              ),
            },
            {
              name: "History Trend",
              selector: (row) => null,
            },
          ]}
        />
      </Paper>
    </div>
  );
}

export default AffectedDataset;
