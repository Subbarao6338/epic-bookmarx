import React from "react";
import { Cancel, CheckCircle, RunCircle } from "@mui/icons-material";

function StatusIcon({ status, color, ...props }) {
  if (status === "success") {
    return <CheckCircle color={color || "success"} {...props} />;
  } else if (status === "running") {
    return <RunCircle color={color || "info"} {...props} />;
  } else {
    // (status === "failed")
    return <Cancel color={color || "error"} {...props} />;
  }
}

export default StatusIcon;
