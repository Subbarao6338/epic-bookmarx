import * as React from "react";
import { Link } from "react-router-dom";
import resource from "./../../assets/self_service/addresource.jpg";
import deleteresource from "./../../assets/self_service/deleteresource.jpg";
const ResourceProvisioningDPAdmin = () => {
  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Resource Provisioning
        </h3>
        <p align="left">
          Provision cloud resources, Kubernetes Cluster and VMs for different
          projects.
        </p>
        <hr />
        <div align="center" className="float-container">
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={resource} id="icon" alt="data" />
              </div>
              <div>
                <b className="">Assign Resource</b>
              </div>
              <p id="info">Configure resources for different projects</p>
              <span>
                <Link
                  to="/assignresource"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Configure Resource
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card1">
              <div style={{ padding: 15 }}>
                <img src={deleteresource} id="icon" alt="software" />
              </div>
              <div>
                <b className="">Delete Resource</b>
              </div>
              <p id="info">
                Clear resource configurations for multiple projects
              </p>
              <span>
                <Link
                  to="/deleteresource"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Clear Configurations
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResourceProvisioningDPAdmin;
