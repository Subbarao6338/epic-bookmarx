import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Button, Grid, Typography } from "@mui/material";
import config from "../../config";
import { Code as CodeIcon } from "@mui/icons-material";
import { Box } from "@mui/system";
import { getdbndTaskDefinition } from "../../apis/pipeline/airflow";

function SourceCode({ dag, dbndTaskRuns }) {
  const { file_token } = dag;
  const [sourceCode, setSourceCode] = useState({ content: "Loading..." });
  const [selectedTask, setSelectedTask] = useState();
  const [selectedTaskCode, setSelectedTaskCode] = useState("");

  const getDagSource = useCallback(() => {
    axios
      .get(config.synergizer_api_url + "/airflow/dag_source/" + file_token)
      .then((res) => {
        // console.log(res.data);
        setSourceCode(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [file_token]);

  useEffect(() => {
    getDagSource();
  }, [getDagSource]);

  useEffect(() => {
    if (selectedTask) {
      const task = dbndTaskRuns?.task_runs.find(
        ({ task_run_uid }) => task_run_uid === selectedTask
      );
      getdbndTaskDefinition(task.task_definition).then((res) => {
        setSelectedTaskCode(res.data.task_definition.source);
      });
    }
  }, [selectedTask]);

  useEffect(() => {
    setSelectedTask(dbndTaskRuns?.task_runs?.[0]?.task_run_uid);
  }, [dbndTaskRuns]);

  return (
    <div className="mt-2">
      <Typography variant="h6" component={"div"}>
        Task Code
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
                      selectedTask === task_run.task_run_uid && "lightgrey",
                  }}
                >
                  <td>{task_run.name}</td>
                  <td>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CodeIcon />}
                      onClick={() => setSelectedTask(task_run.task_run_uid)}
                    >
                      Code
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              height: "60vh",
              overflow: "scroll",
              backgroundColor: "whitesmoke",
            }}
          >
            <ReactSyntaxHighlighter language="python" style={atomOneLight}>
              {selectedTaskCode}
            </ReactSyntaxHighlighter>
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Typography variant="h6" component={"div"}>
          Module Code
        </Typography>
        <Box sx={{ border: "1px solid lightgrey" }}>
          <ReactSyntaxHighlighter language="python" style={atomOneLight}>
            {sourceCode.content}
          </ReactSyntaxHighlighter>
        </Box>
      </Box>
    </div>
  );
}

export default SourceCode;
