import * as React from "react";
import { Link } from "react-router-dom";
import create_proj from "../../assets/project_mgmt/add_proj.png";
import edit_proj from "../../assets/project_mgmt/edit_proj.png";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import ProjectManagementLead from "./projectManagement";
import ProjectManagementTeamMember from "./projectManagementMember";

const ProjectManagement = () => {
  const AccountInfo = AccountInfoDetails();

  const AccountRole = AccountInfo["AccountRole"];
  //const AccountName = AccountInfo["AccountName"];
  const AccountMail = AccountInfo["AccountMail"];

  if (AccountRole === "Data Engineer - Team Lead") {
    return <ProjectManagementLead />;
  } else if (AccountRole === "Data Engineer - Team Member") {
    return <ProjectManagementTeamMember accountMail={AccountMail} />;
  }
  else {
    return (
      <div id="page">
        <div>
          <h3 align="left" id="heading">
            Project Management
          </h3>
          <p align="left">Manage all the projects</p>
          <hr />
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={create_proj} id="icon" alt="add" />
              </div>
              <div>
                <b className="">Create New Project</b>
              </div>
              <p id="info">Create new project and assign team lead</p>
              <span>
                <Link
                  to="/create_project"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Create Project
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={edit_proj} id="icon" alt="delete" />
              </div>
              <div>
                <b className="">Edit Existing Project</b>
              </div>
              <p id="info">Edit or delete project to change team leads</p>
              <span>
                <Link
                  to="/edit_project"
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Edit Project
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default ProjectManagement;
