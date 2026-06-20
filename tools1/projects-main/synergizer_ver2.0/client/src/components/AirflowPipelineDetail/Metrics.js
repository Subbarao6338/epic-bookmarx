import React, { useEffect, useState } from "react";
import config from "../../config";

function Metrics({ dbndTaskRuns }) {
  const [taskRunMetrics, setTaskRunMetrics] = useState();

  return (
    <div>
      {dbndTaskRuns?.task_runs?.map((task_run) => (
        <div key={task_run.task_run_uid}>
          <li>
            {task_run.name}

            <a
              target="_blank"
              href={
                config.synergizer_api_url +
                `/v1/airflow/task_runs/${task_run.task_run_uid}/task_run_attempts/${task_run.task_run_attempt_uid}/metrics/`
              }
            >
              metrics
            </a>
          </li>
        </div>
      ))}
    </div>
  );
}

export default Metrics;
