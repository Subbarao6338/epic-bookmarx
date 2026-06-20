import * as React from "react";
import { Link } from "react-router-dom";
import add_user_img from "../../assets/user_mgmt/add_users.png";
import delete_user_img from "../../assets/user_mgmt/remove_users.png";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory, useLocation } from "react-router-dom";

const UserManagement = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountRole = AccountInfo["AccountRole"];

  const location = useLocation();
  let history = useHistory();

  const { proj_id } =
    typeof location.state === "undefined" ? "" : location.state;
  const { proj_name } =
    typeof location.state === "undefined" ? "" : location.state;

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
    {
      id: "user_management",
      route_url: "/user_management",
      text: "User Management",
    },
  ];

  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push({
      pathname: navdata[itemIndex]["route_url"],
      state: { proj_id: proj_id, proj_name: proj_name },
    });
  };
  return (
    <React.Fragment>
      {AccountRole === "Data Engineer - Team Lead" ? (
        <Breadcrumb
          className="navigationbtn"
          data={navdata}
          onItemSelect={handleItemSelect}
        />
      ) : (
        <div></div>
      )}
      <div id="page">
        <div>
          <h3 align="left" id="heading">
            User Management
          </h3>
          <p align="left">Manage all the users based on their role</p>
          <hr />

          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={add_user_img} id="icon" alt="add" />
              </div>
              <div>
                <b className="">Add New Users</b>
              </div>
              <p id="info">Add new user and assign project and role</p>
              <span>
                <Link
                  to={{
                    pathname: "/add_user",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  }}
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Add Users
                </Link>
              </span>
            </div>
          </div>
          <div className="float-child3">
            <div id="card">
              <div style={{ padding: 15 }}>
                <img src={delete_user_img} id="icon" alt="delete" />
              </div>
              <div>
                <b className="">Delete Existing Users</b>
              </div>
              <p id="info">
                Delete or Remove user from assigned project or role
              </p>
              <span>
                <Link
                  to={{
                    pathname: "/delete_user",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  }}
                  id="link"
                  style={{ padding: "2px 45px" }}
                >
                  Delete Users
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default UserManagement;
