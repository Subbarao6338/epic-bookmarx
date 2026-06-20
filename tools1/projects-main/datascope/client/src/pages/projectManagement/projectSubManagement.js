import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import user_tile from "../../assets/menu_icons/user_management.png";
import resource_tile from "../../assets/menu_icons/resource_provisioning.png";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";

const ProjectSubManagement = () => {
  const location = useLocation();
  const { proj_id } = location.state;
  const { proj_name } = location.state;
  const { proj_desc } = location.state;

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
    {
      id: "projectsubmanagement",
      route_url: "/project_submanagement",
      text: proj_name,
    },
  ];

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push({
      pathname: navdata[itemIndex]["route_url"],
      state: { proj_id: proj_id, proj_name: proj_name, proj_desc: proj_desc },
    });
  };

  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div id="page">
        <div>
          <br />
          <h3 align="left" id="heading">
            {proj_name}
          </h3>
          <p align="left">{proj_desc}</p>
          <hr />
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={user_tile} id="icon" alt="add" />
              </div>
              <div>
                <b className="">User Management</b>
              </div>
              <p id="info">Manage all the users based on their role</p>
              <span>
                <Link
                  to={{
                    pathname: "/user_management",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  }}
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Explore
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={resource_tile} id="icon" alt="delete" />
              </div>
              <div>
                <b className="">Provisioned Resource Details</b>
              </div>
              <p id="info">
                Manage the project wise resource provisioned details
              </p>
              <span>
                <Link
                  to={{
                    pathname: "/provisioned_resourcedetails",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  }}
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Explore
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={resource_tile} id="icon" alt="configuration" />
              </div>
              <div>
                <b className="">Centralized Configuration</b>
              </div>
              <p id="info">Manage the configurations used in project.</p>
              <span>
                <Link
                  to={{
                    pathname: "/central_config",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  }}
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Explore
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectSubManagement;
