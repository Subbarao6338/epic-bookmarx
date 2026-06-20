import React, { useCallback, useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  DialogContent,
  IconButton,
  Paper,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useNavigate, useParams } from "react-router-dom";
import StatusIcon from "../StatusIcon";
import {
  getAirflowDagRunTasks,
  getAirflowTaskRunLog,
  getDbndTaskRunLog,
} from "../../apis/pipeline/airflow";
import { Box } from "@mui/system";

function Logs({ dag, dbndTaskRuns }) {
  const { dag_id, dag_run_id } = useParams();
  const [data, setData] = useState({
    task_instances: [],
    total_entries: 0,
  });

  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({});
  const [selectedDbndTask, setSelectedDbndTask] = useState();
  const [selectedDbndLog, setSelectedDbndLog] = useState();

  const navigate = useNavigate();

  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedTask(row);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedTask({});
  };

  const loadTaskInstances = useCallback(() => {
    getAirflowDagRunTasks(dag_id, dag_run_id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dag_id, dag_run_id]);

  useEffect(() => {
    loadTaskInstances();
  }, [loadTaskInstances]);

  useEffect(() => {
    if (selectedDbndTask) {
      const task = dbndTaskRuns?.task_runs?.find(
        ({ task_run_uid }) => task_run_uid === selectedDbndTask
      );
      getDbndTaskRunLog(task.task_run_uid, task.task_run_attempt_uid).then(
        (res) => {
          console.log(res.data);
          setSelectedDbndLog(res.data);
        }
      );
    }
  }, [selectedDbndTask]);

  useEffect(() => {
    setSelectedDbndTask(dbndTaskRuns?.task_runs?.[0]?.task_run_uid);
  }, [dbndTaskRuns]);

  return (
    <div>
      <Paper>
        <DataTable
          data={data.task_instances}
          columns={[
            {
              name: "Task Id",
              selector: "task_id",
              sortable: true,
            },
            {
              name: "State",
              selector: "state",
              cell: ({ state }) => (
                <span className="pe-none">
                  <StatusIcon status={state} fontSize="small" /> {state}
                </span>
              ),
              sortable: true,
              width: "100px",
            },

            {
              name: "Run Id",
              selector: "dag_run_id",
              sortable: true,
            },
            {
              id: "start_date",
              name: "Start Date",
              selector: "start_date",
              sortable: true,
            },
            {
              name: "End Date",
              selector: "end_date",
              sortable: true,
            },
            {
              name: "Operator",
              selector: "operator",
              sortable: true,
            },

            {
              name: "Try Number",
              selector: "try_number",
              sortable: true,
            },
            {
              name: "Duration(sec)",
              selector: "duration",
              sortable: true,
            },
          ]}
          defaultSortAsc={false}
          defaultSortFieldId={"start_date"}
          onRowClicked={handleClickOpen}
          pointerOnHover
          highlightOnHover
          pagination
          responsive
        />
      </Paper>
      <SimpleDialog
        selectedTask={selectedTask}
        open={open}
        onClose={handleClose}
      />
      <div className="mt-2">
        <Typography variant="h6" component={"div"}>
          Task Log
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            <table className="table">
              <tbody>
                {dbndTaskRuns?.task_runs?.map((task_run) => (
                  <tr
                    id={task_run.task_run_uid}
                    style={{
                      backgroundColor:
                        selectedDbndTask === task_run.task_run_uid &&
                        "lightgrey",
                    }}
                  >
                    <td>{task_run.name}</td>
                    <td>
                      <Button
                        size="small"
                        variant="contained"
                        // startIcon={<CodeIcon />}
                        onClick={() =>
                          setSelectedDbndTask(task_run.task_run_uid)
                        }
                      >
                        Log
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ backgroundColor: "whitesmoke", padding: "8px" }}>
              <pre>
                <code>{selectedDbndLog?.task_run_log?.[0]?.log_body}</code>
              </pre>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Logs;

function SimpleDialog(props) {
  const { onClose, selectedTask, open } = props;
  const { dag_id, dag_run_id, task_id, try_number } = selectedTask;
  const [logData, setLogData] = useState({ content: null });

  const handleClose = () => {
    setLogData({ content: null });
    onClose();
  };

  const fetchLog = useCallback(() => {
    getAirflowTaskRunLog(dag_id, dag_run_id, task_id, try_number)
      .then((res) => {
        // console.log(typeof res.data.content);
        setLogData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dag_id, dag_run_id, task_id, try_number]);

  useEffect(() => {
    if (dag_id && dag_run_id && task_id && try_number) {
      fetchLog();
    }
  }, [dag_id, dag_run_id, task_id, try_number, fetchLog]);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth={true}>
      <DialogTitle>
        <span className="me-2">Log:</span>
        <Typography component={"span"} fontSize={"small"}>
          Dag Id: <b>{dag_id}</b>, Run Id: <b>{dag_run_id}</b>, Task Id:{" "}
          <b>{task_id}</b>, Try Number: <b>{try_number}</b>
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="bg-light">
        <pre className="d-inline">
          <code className="d-inline">
            {logData.content?.replaceAll("\\n", "\n").replaceAll("\\", "") ||
              "Loading..."}
          </code>
        </pre>
      </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedTask: PropTypes.object.isRequired,
};
