import * as React from "react";
import { Label } from "@progress/kendo-react-labels";
import { get_project_details, tenant_id } from "../../commonUtility/api_urls";
import { httpget } from "../../commonUtility/common_http";

function ProjectManagementTeamMember(accountMail) {
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [msg, setMsg] = React.useState("Loading...");

  console.log(accountMail);
  React.useEffect(() => {
    const req_value = {
      params: {
        tenant_id: tenant_id,
        user_mail: accountMail,
      },
    };

    httpget(get_project_details, req_value).then((results) => {
      console.log(results);
      if (results.projectDetails === "No Project") {
        setMsg("No Project Assigned");
      } else {
        setProjectDetails(results.projectDetails.data);
      }
    });
  }, []);

  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Project Management
        </h3>
        <p align="left">My project details</p>
        <hr />
        {projectDetails.length > 0 ? (
          <div className="text-start form_left">
            <div className="row mb-3">
              <div>
                <Label>Project Name : &nbsp; </Label>{" "}
                <Label>{projectDetails[0].projectname}</Label>
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label>Team Lead Name : &nbsp; </Label>{" "}
                <Label>{projectDetails[0].lead_name}</Label>
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label>Team Lead Email : &nbsp; </Label>{" "}
                <Label type="email">{projectDetails[0].lead_mail}</Label>
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label>Start Date : &nbsp; </Label>{" "}
                <Label>
                  {new Date(projectDetails[0].created_on).toLocaleDateString()}
                </Label>
              </div>{" "}
            </div>{" "}
          </div>
        ) : (
          <div className="content_center" style={{ height: 300, width: 1200 }}>
            <span style={{ fontSize: 24 }}>{msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProjectManagementTeamMember;
