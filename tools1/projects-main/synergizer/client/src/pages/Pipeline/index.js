import { Typography } from "@mui/material";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AirflowPipelineDetail from "../../components/AirflowPipelineDetail";

function DefaultView() {
  return (
    <div>
      <Typography component={"h2"} variant="h5">
        Pipelines
      </Typography>
      <div>
        <Typography variant="h6">Airflow</Typography>
        <Link to="/pipeline/airflow/CKAN_ETL">CKAN_ETL</Link>
      </div>
    </div>
  );
}

function Pipeline() {
  return (
    <Routes>
      <Route index element={<DefaultView />} />
      <Route path="/airflow/:dag_id" element={<AirflowPipelineDetail />} />
    </Routes>
  );
}

export default Pipeline;
