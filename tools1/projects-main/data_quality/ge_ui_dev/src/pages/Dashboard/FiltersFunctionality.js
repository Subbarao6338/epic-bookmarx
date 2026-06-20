import axios from "axios";
import React, { useState, useEffect } from "react";
import { ge_api_url } from "../../config/api";

function FiltersFunctionality() {
  return (
    <div className="row mb-3">
      <div className="col-2">
        <label>Data Source </label>
        <select
          style={{ width: "200px", height: "35px" }}
          className="form-select"
        >
          <option>All</option>
        </select>
      </div>
      <div className="col-2">
        <label>Dataset</label>
        <select
          style={{ width: "200px", height: "35px" }}
          className="form-select"
        >
          <option>All</option>
        </select>
      </div>
      <div className="col-2">
        <label>Critical Data Elements</label>
        <select
          style={{ width: "200px", height: "35px" }}
          className="form-select"
        >
          <option>All</option>
        </select>
      </div>
      <div className="col-2">
        <label>Dimension</label>
        <select
          style={{ width: "200px", height: "35px" }}
          className="form-select"
        >
          <option>All</option>
        </select>
      </div>
      <div className="col-3">
        <label>Rule</label>
        <select
          style={{ width: "350px", height: "35px" }}
          className="form-select"
        >
          <option>All</option>
        </select>
      </div>
    </div>
  );
}

export default FiltersFunctionality;
