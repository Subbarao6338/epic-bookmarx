import axios from "axios";
import React, { useState, useEffect } from "react";
import { ge_api_url } from "../../config/api";
import TabGroup from "./tabs";

function Dashboard() {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
      }}
    >
      <TabGroup />
    </div>
  );
}

export default Dashboard;
