import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { getDbndTaskRunMetrics } from "../../apis/pipeline/airflow";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Histogram({ dbndTaskRuns }) {
  const [selectedTask, setSelectedTask] = useState();
  const [taskRunMetrics, setTaskRunMetrics] = useState();
  const [histogramMetrics, setHistogramMetrics] = useState([]);

  const handleTaskSelect = (task) => {
    getDbndTaskRunMetrics(task.task_run_uid, task.task_run_attempt_uid).then(
      (res) => {
        setTaskRunMetrics(res.data);
        const histogramMetrics = res.data.task_run_metrics.filter(({ key }) => {
          return key.split(".")?.pop() === "histograms";
        });
        setHistogramMetrics(histogramMetrics);
      }
    );
  };

  useEffect(() => {
    if (dbndTaskRuns?.task_runs) {
      setSelectedTask(dbndTaskRuns?.task_runs?.[0]);
    }
  }, [dbndTaskRuns]);

  useEffect(() => {
    if (selectedTask) handleTaskSelect(selectedTask);
  }, [selectedTask]);

  return (
    <div>
      <div>Task Runs</div>
      <div>
        {dbndTaskRuns?.task_runs?.map((task_run) => (
          <Button
            key={task_run.task_run_uid}
            variant={
              selectedTask?.task_run_uid === task_run.task_run_uid
                ? "contained"
                : "outlined"
            }
            sx={{
              margin: 0.25,
              textTransform: "none",
            }}
            onClick={() => setSelectedTask(task_run)}
          >
            {task_run.name}
          </Button>
        ))}
      </div>
      <div>
        {histogramMetrics.length > 0 ? (
          histogramMetrics.map((histogramMetric) => (
            <div>
              <div>{histogramMetric.key}</div>
              <Grid container spacing={2}>
                {Object.keys(JSON.parse(histogramMetric.value_json)).map(
                  (col) => (
                    <Grid key={col} item md={4}>
                      <BarChart
                        width={300}
                        height={280}
                        data={JSON.parse(histogramMetric.value_json)[
                          col
                        ][0].map((y, i) => ({
                          x:
                            "" +
                            JSON.parse(histogramMetric.value_json)[col][1][i],
                          y: y,
                        }))}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        barCategoryGap={0}
                      >
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="y" fill="#8884d8" name={col} />
                      </BarChart>
                    </Grid>
                  )
                )}
              </Grid>
            </div>
          ))
        ) : (
          <div>No Data Available</div>
        )}
      </div>
    </div>
  );
}

export default Histogram;
