import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Log from "./Log";

function Explore() {
  return (
    <Routes>
      <Route index element={<Navigate to="/explore/log" replace />} />
      <Route path="/log" index element={<Log />} />
    </Routes>
  );
}

export default Explore;
