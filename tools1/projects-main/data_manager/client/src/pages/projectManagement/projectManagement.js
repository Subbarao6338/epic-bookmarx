import * as React from "react";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { httpget } from "../../commonUtility/common_http";
import { getprojects_userbased_url } from "../../commonUtility/api_urls";
import { Link } from "react-router-dom";
import projectImg from "../../assets/project_mgmt/project.png";
loadMessages(enMessages, "en-US");

const ProjectManagementLead = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountName = AccountInfo["AccountName"];
  const AccountMail = AccountInfo["AccountMail"];

  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountMail, AccountName: AccountName },
    };

    console.log(getprojects_userbased_url);
    httpget(getprojects_userbased_url, req_value).then((result) => {
      console.log(result);
      console.log(result.length);

      setProjects(result.length === 0 ? "" : result);
    });
  }, []);

  return (
    <React.Fragment>
      <div>
        <div>
          <div>
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.project_management}
            </h3>
          </div>
          <hr />
          {projects === "" ? (
            <div
              className="content_center"
              style={{ height: 400, width: 1200 }}
            >
              <span style={{ fontSize: 24 }}> No Projects Assigned...</span>
            </div>
          ) : (
            <div className="row ms-3 scroll" style={{ height: 400 }}>
              {projects.map((project) => (
                <div className="col-2 project_tiles">
                  <Link
                    className="linkdecoration"
                    to={{
                      pathname: "/project_submanagement",
                      state: {
                        proj_id: project.projid,
                        proj_name: project.projectname,
                        proj_desc: project.description,
                      },
                    }}
                  >
                    <div id="projectcard">
                      <div style={{ padding: 5 }}>
                        <img src={projectImg} id="icon" alt="data" />
                      </div>
                      <div>
                        <b className=""> {project.projectname} </b>
                      </div>
                      <hr />
                      <p
                        id="info"
                        className="projectdesc"
                        title={project.description}
                      >
                        {project.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProjectManagementLead;
