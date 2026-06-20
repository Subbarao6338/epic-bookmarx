import {
  Cancel,
  CheckCircle,
  Info,
  NavigateNext,
  NotificationImportant,
  RunCircle,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getAirflowMetrics,
  getAirflowPipelines,
} from "../../apis/pipeline/airflow";
import * as dfd from "danfojs";
import { Box } from "@mui/system";
import airflowIcon from "../../assets/images/airflow_icon.png";
import StatusIcon from "../../components/StatusIcon";
import DataTable from "react-data-table-component";

// Grid view
function PipelineGridView({ pipelines }) {
  return (
    <Grid container alignItems={"stretch"} spacing={1}>
      {pipelines?.dags.map((pipeline) => (
        <Grid key={pipeline.dag_id} item sm={6} md={4} lg={3}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            variant="outlined"
          >
            <CardContent>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{ width: "60%" }}
                  noWrap
                  component={"span"}
                  variant="subtitle2"
                >
                  {pipeline.dag_id}
                </Typography>
                <Typography
                  sx={{
                    padding: 0.5,
                    marginLeft: "auto",
                    border: "1px solid whitesmoke",
                  }}
                  noWrap
                  component={"span"}
                  variant="body2"
                >
                  <img
                    src={airflowIcon}
                    alt="airflow"
                    width="12px"
                    height="auto"
                  />{" "}
                  Airflow
                </Typography>
              </Box>
              <div>
                <Typography variant="body2">
                  <Info color={"info"} fontSize={"inherit"} /> Service:{" "}
                  {pipeline.is_paused ? "Paused" : "Active"}
                </Typography>
              </div>
              <div>
                <Typography
                  mr={1}
                  noWrap
                  color={"#d32f2f"}
                  component={"span"}
                  variant="body2"
                >
                  <Cancel fontSize="inherit" /> Failed {pipeline.failed}
                </Typography>
                <Typography
                  mr={1}
                  noWrap
                  color={"green"}
                  component={"span"}
                  variant="body2"
                >
                  <CheckCircle fontSize="inherit" /> Success {pipeline.success}
                </Typography>
                {pipeline.running > 0 && (
                  <Typography
                    mr={1}
                    noWrap
                    color={"lightblue"}
                    component={"span"}
                    variant="body2"
                  >
                    <RunCircle fontSize="inherit" /> Running {pipeline.running}
                  </Typography>
                )}
              </div>
            </CardContent>
            <CardActions
              sx={{ marginTop: "auto", backgroundColor: "whitesmoke" }}
            >
              <Button
                color={
                  pipeline.last_status === "success"
                    ? "success"
                    : pipeline.last_status === "failed"
                    ? "error"
                    : pipeline.last_status === "running"
                    ? "info"
                    : "primary"
                }
                component={Link}
                to={`/pipeline_run/${pipeline.dag_id}`}
                sx={{ textTransform: "none" }}
                size="small"
              >
                {
                  <StatusIcon
                    status={pipeline.last_status}
                    fontSize="inherit"
                  />
                }{" "}
                {moment(pipeline.last_run).calendar()}{" "}
                <NavigateNext fontSize="inherit" />
              </Button>
              <IconButton size="small" sx={{ marginLeft: "auto !important" }}>
                <NotificationImportant fontSize="inherit" />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// List view
function PipelineListView({ pipelines }) {
  return (
    <Paper>
      <DataTable
        data={pipelines?.dags}
        columns={[
          {
            name: "Name",
            selector: ({ dag_id }) => dag_id,
            sortable: true,
          },

          {
            name: "States",
            selector: ({ failed }) => failed,
            cell: (row) =>
              ["failed", "success", "running"].map(
                (state) =>
                  row[state] > 0 && (
                    <Box
                      key={state}
                      sx={{
                        width: "96px",
                        paddingRight: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <StatusIcon status={state} fontSize="small" />{" "}
                      {row[state]} {state}
                    </Box>
                  )
              ),
            width: "316px",
            sortable: true,
          },
          {
            name: "Source",
            selector: () => "Airflow",
            sortable: true,
          },
          {
            name: "Service",
            selector: ({ is_paused }) => (is_paused ? "Paused" : "Active"),
            sortable: true,
          },
          {
            name: "Alerts",
            selector: ({ is_paused }) => "NA",
          },
          {
            name: "Last Run",
            selector: ({ last_run }) => last_run,
            cell: ({ last_run, last_status }) => (
              <span>
                <StatusIcon status={last_status} fontSize={"small"} />{" "}
                {moment(last_run).calendar()}
              </span>
            ),
            sortable: true,
          },
        ]}
      />
    </Paper>
  );
}

// Main Pipeline View
function PipelinesView() {
  const [pipelines, setPipelines] = useState({
    dags: [],
    total_entries: 0,
  });
  const [viewMode, setViewMode] = useState("gridView");

  const loadPipelines = useCallback(() => {
    const r1 = getAirflowPipelines();
    const r2 = getAirflowMetrics();

    Promise.all([r1, r2]).then(([res1, res2]) => {
      console.log(res1, res2);
      const df1 = new dfd.DataFrame(res1.data.dags);
      const df2 = new dfd.DataFrame(res2.data);
      const merged = dfd
        .merge({
          left: df1,
          right: df2,
          on: ["dag_id"],
          how: "left",
        })
        .fillNa(0);
      const result = dfd.toJSON(merged);
      res1.data.dags = result;
      setPipelines(res1.data);
    });
  }, []);

  const changeViewMode = (e, value) => {
    if (value) {
      setViewMode(value);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, [loadPipelines]);

  return (
    <div>
      <Typography variant="h5" component={"div"}>
        Airflow Pipelines
      </Typography>
      <div className="d-flex align-items-center p-2 mb-2 bg-light">
        <Typography component={"span"}>
          {pipelines?.dags.length} Piplines
        </Typography>
        <span className="ms-auto me-2">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={viewMode}
            onChange={changeViewMode}
          >
            <ToggleButton value={"gridView"}>
              <ViewModule />
            </ToggleButton>
            <ToggleButton value={"listView"}>
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </span>
        <span>
          <TextField size="small" variant={"outlined"} label="Search" />
        </span>
      </div>
      <div>
        {viewMode === "gridView" ? (
          <PipelineGridView pipelines={pipelines} />
        ) : (
          <PipelineListView pipelines={pipelines} />
        )}
      </div>
    </div>
  );
}

export default PipelinesView;
