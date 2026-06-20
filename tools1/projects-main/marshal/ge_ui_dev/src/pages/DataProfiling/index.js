import React, { useState } from "react";
import RunProfiling from "./RunProfiling";

function DataProfiling() {
  const [openProfiler, setOpenProfiler] = useState(false);
  const [profileReport, setProfileReport] = useState(null);

  return (
    <div className="bg-white p-3">
      <div className="border">
        <h4 className="text-center border p-1">
          <b>DATA PROFILING</b>
        </h4>
        <RunProfiling />
      </div>
    </div>
  );
}

export default DataProfiling;
