import * as React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { httpget } from "../../commonUtility/common_http";
import { getprojects_userbased_url } from "../../commonUtility/api_urls";
import { Link } from "react-router-dom";
loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/home",
    text: "Home",
  },
  {
    id: "project_management",
    route_url: "/project_management",
    text: "Project Management",
  },
];

const ProjectManagementLead = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountName = AccountInfo["AccountName"];
  const AccountMail = AccountInfo["AccountMail"];

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [projects, setProjects] = React.useState([]);
  React.useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountMail, AccountName: AccountName },
    };

    console.log(getprojects_userbased_url);
    httpget(getprojects_userbased_url, req_value).then((result) => {
      console.log(result);
      setProjects(result);
    });
  }, []);

  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />

      <div>
        <div>
          <div>
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.project_management}
            </h3>
          </div>
          <hr />

          <div className="row ms-3 scroll" style={{ height: 400 }}>
            {projects.map((project) => (
              <div className="col-2 project_tiles">
                <Link
                  to={{
                    pathname: "/project_submanagement",
                    state: {
                      proj_id: project.projid,
                      proj_name: project.projectname,
                      proj_desc: project.description,
                    },
                  }}
                >
                  <div className="project_boxcontent">
                    <div className="text-center tiles_title">
                      {project.projectname}
                    </div>
                    <hr />
                    <div className="text-center">{project.description}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProjectManagementLead;
