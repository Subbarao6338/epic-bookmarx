import * as React from "react";
import { Link } from "react-router-dom";
import cost from "../assets/cost_usage/cost_usage_calculator.png";
import usage from "../assets/cost_usage/database-usage.png";

const CostUsage = () => {
  return (
    <div id="page">
      <div>
        <h3 id="heading" align="left">
          Cost and Usage
        </h3>
        <p align="left">
          List out cost details of available services being used, and track
          their usage across the organization
        </p>
        <hr />
        <div align="center" className="float-container">
          <div className="float-child2">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={cost} id="icon" alt="cost" />
              </div>
              <div>
                <b className="">Cost Management</b>
              </div>
              <p id="info">
                View and analyze the costs involved in the project across
                services, geogrpahies and resources
              </p>
              <span>
                <Link to="/cost_charts" id="link">
                  Explore
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child2">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={usage} id="icon" alt="usage" />
              </div>
              <div>
                <b className="">Usage Management</b>
              </div>
              <p id="info">
                View users across different data assets, usage by geography and
                utilization of assets{" "}
              </p>
              <span>
                <Link to="/usage_charts" id="link">
                  Explore
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostUsage;
