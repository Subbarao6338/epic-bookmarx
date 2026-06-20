import * as React from "react";
import aion from "../assets/data_science/AION logo.png";
import azureml from "../assets/data_science/Azure ML Services.png";
import synapse from "../assets/data_science/synapse.png";
import databricks from "../assets/data_science/databricks.png";
import { Link } from "react-router-dom";

const urlItems = [
  {
    name: "databricks",
    route_url:
      "https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Databricks%2Fworkspaces",
  },
  {
    name: "azureml",
    route_url:
      "https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.MachineLearningServices%2Fworkspaces",
  },
  {
    name: "aion",
    route_url:
      "https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.MachineLearningServices%2Fworkspaces",
  },
];

const DataScience = () => {
  const [urldata] = React.useState(urlItems);
  const LaunchURL = (name) => {
    const itemIndex = urldata.findIndex((curValue) => curValue.name === name);
    const url = urldata[itemIndex]["route_url"];
    window.open(url, "_blank");
  };

  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Data Science
        </h3>
        <p align="left">
          Run analytics for industry specific use cases based on requirements
          using various best-of-breed tools, check details and status of product
          instances requested, use tools and services for model creation and
          training
        </p>
        <hr />
        <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={azureml} id="icon" alt="azureml" />
              </div>
              <div>
                <b className="">Azure ML Service</b>
              </div>
              <p id="info">
                A cloud based service that enables users to create, train and
                deploy ML models in the cloud
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL("azureml")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>

          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={aion} id="icon" style={{ width: 100 }} alt="aion" />
              </div>
              <div>
                <b className="">HCL's AION</b>
              </div>
              <p id="info">
                An AI lifecycle management platform for applying machine
                learning to real world problems
              </p>
              <br />
              <span>
                <Link onClick={() => LaunchURL("aion")} id="link">
                  Launch
                </Link>
              </span>
            </div>
          </div>

          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={databricks} id="icon" alt="mlaas" />
              </div>
              <div>
                <b className="">Databricks</b>
              </div>
              <p id="info">
                Unified open platform for all data to empowering data
                scientists, engineers & analysts to run interactive and
                scheduled data analysis workloads
              </p>
              <span>
                <Link onClick={() => LaunchURL("databricks")} id="link">
                  Launch
                </Link>
              </span>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScience;
