import React, { useCallback, useEffect, useState } from "react";
import { Close, OpenInNew } from "@mui/icons-material";
import { DialogContent, IconButton, Typography } from "@mui/material";
import axios from "axios";
import DataTable from "react-data-table-component";
import config from "../../config";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

function Logs({ dag }) {
  const { dag_id } = dag;
  const [data, setData] = useState({
    task_instances: [],
    total_entries: 0,
  });

  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({});

  const columns = [
    {
      name: "Log",
      selector: (row) => (
        <IconButton color={row.state} onClick={() => handleClickOpen(row)}>
          <OpenInNew fontSize="small" />
        </IconButton>
      ),
      button: true,
      width: "80px",
    },

    {
      name: "Task Id",
      selector: "task_id",
      sortable: true,
    },
    {
      name: "State",
      selector: "state",
      cell: ({ state }) => <span className={`px-1 btn-${state}`}>{state}</span>,
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
  ];

  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedTask(row);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedTask({});
  };

  const loadTaskInstancesBatch = useCallback(() => {
    axios
      .get(
        config.synergizer_api_url +
          `/airflow/dags/-/task_instances_batch/?dag_ids = ${dag_id}`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dag_id]);

  useEffect(() => {
    loadTaskInstancesBatch();
  }, [loadTaskInstancesBatch]);

  return (
    <div>
      <div className="p-2">
        <label className="me-2">
          <b>Filter:</b>
        </label>
        <span className="border rounded-pill px-1">
          Time Range: Last 24 hours
        </span>
      </div>
      <div className="border">
        <DataTable
          data={data.task_instances}
          columns={columns}
          defaultSortAsc={false}
          defaultSortFieldId={"start_date"}
          pagination
          dense
          responsive
        />
      </div>
      <SimpleDialog
        selectedTask={selectedTask}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}

export default Logs;

function SimpleDialog(props) {
  const { onClose, selectedTask, open } = props;
  const [logData, setLogData] = useState({ content: null });

  const handleClose = () => {
    onClose();
  };

  const fetchLog = useCallback(() => {
    axios
      .get(
        config.synergizer_api_url +
          `/airflow/dags/${selectedTask.dag_id}/dagRuns/${selectedTask.dag_run_id}/taskInstances/${selectedTask.task_id}/logs/${selectedTask.try_number}/?`
      )
      .then((res) => {
        console.log(typeof res.data.content);
        setLogData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTask.dag_run_id && selectedTask.task_id) {
      fetchLog();
    }
  }, [selectedTask, fetchLog]);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth={true}>
      <DialogTitle>
        <span className="me-2">Log:</span>
        <Typography component={"span"} fontSize={"small"}>
          {`Dag Id: ${selectedTask.dag_id}, Run Id: ${selectedTask.dag_run_id}, Task Id: ${selectedTask.task_id}, Try Number: ${selectedTask.try_number}`}
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
            {eval(logData.content)?.join("\n") || "Loading..."}
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
