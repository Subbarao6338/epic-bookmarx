import React, { useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory, useLocation } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
import { httppost, httpget } from "./../../commonUtility/common_http";
import { SaveButton, CancelButton } from "../../components/Buttons/buttons";
import {
  create_user,
  tenant_id,
  is_user_exist,
} from "./../../commonUtility/api_urls";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
loadMessages(enMessages, "en-US");

const AddUser = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountRole = AccountInfo["AccountRole"];
  let history = useHistory();
  const location = useLocation();
  const { proj_id } =
    typeof location.state === "undefined" ? "" : location.state;
  const { proj_name } =
    typeof location.state === "undefined" ? "" : location.state;
  const navitems = [
    {
      id: "home",
      route_url: "/user_management",
      text: "User Management",
    },
    {
      id: "add_user",
      route_url: "/add_user",
      text: "Add New Users",
    },
  ];
  const navitemslead = [
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
    {
      id: "add_user",
      route_url: "/add_user",
      text: "Add New Users",
    },
  ];
  const [navdata] = React.useState(
    AccountRole === "DP Admin" ? navitems : navitemslead
  );
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push({
      pathname: navdata[itemIndex]["route_url"],
      state: { proj_id: proj_id, proj_name: proj_name },
    });
  };
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Emp_ID, setEmp_ID] = useState("");
  // const [value, setValue] = React.useState("Select Organization");
  const [err_msg, seterr_msg] = useState("");
  const handlecancel = () => {
    history.push({
      pathname: "/user_management",
      state: { proj_id: proj_id, proj_name: proj_name },
    });
  };

  function ValidateEmail(email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      if (email.indexOf("@hcl.com", email.length - "@hcl.com".length) !== -1) {
        return true;
      }
    }
    return false;
  }

  function validateEmpId(Emp_ID) {
    if (Emp_ID.length !== 8) {
      return false;
    }
    if (!/^[0-9]+$/.test(Emp_ID)) {
      return false;
    }
    return true;
  }

  const createuser = () => {
    console.log("click");
    if (Name === "" && Email === "" && Emp_ID === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (Name.length <= 3) {
      seterr_msg("Enter Valid  Name.");
    } else if (!ValidateEmail(Email)) {
      seterr_msg("Enter Valid Email");
    } else if (!validateEmpId(Emp_ID)) {
      seterr_msg("Enter Valid Emp ID");
    } else {
      const req_value = {
        params: {
          user_name: Name,
          user_mail: Email,
          user_id: "",
          user_type: "create",
        },
      };
      httpget(is_user_exist, req_value).then((result) => {
        console.log(result);
        var user_count = result[0].count;
        if (parseInt(user_count) > 0) {
          seterr_msg(
            "Entered User Name or Email Already Exists. Please Enter Unique User Name."
          );
        } else {
          const req_value = {
            params: {
              Name: Name,
              Email: Email,
              Emp_ID: Emp_ID,
              role_id: AccountRole === "DP Admin" ? "3" : "4",
              tenant_id: tenant_id,
              AccountRole: AccountRole,
              proj_id: AccountRole === "DP Admin" ? "" : proj_id,
            },
          };
          console.log(req_value);
          httppost(create_user, req_value).then((result) => {
            if (result.data === "Success") {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_none"];
              const alert_msg = '"' + Name + '" User Created Successfully.';
              Swal.fire({
                position: "center",
                icon: "success",
                title: "User Created Successfully.",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Add Another User",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  // history.push({
                  //   pathname: "/add_user",
                  //   state: { proj_id: proj_id, proj_name: proj_name },
                  // });
                  window.location.reload();
                } else {
                  history.push({
                    pathname: "/user_management",
                    state: { proj_id: proj_id, proj_name: proj_name },
                  });
                }
              });
              // history.push({
              //   pathname: "/delete_user",
              //   state: { proj_id: proj_id, proj_name: proj_name },
              // });
            } else {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_error"];
              const alert_msg = '"' + Name + '" User Creation Failed.';
              Swal.fire({
                position: "center",
                icon: "error",
                title: "User Creation Failed.",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
        }
      });
    }
  };

  return (
    <React.Fragment>
      <ReactTooltip />
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <div>
            <br />
            <h3 id="heading" align="left">
              Add User
            </h3>
          </div>
          <hr />
        </div>
        <div style={{ width: "80vw" }}>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="text-start form_left">
              <div className="row mb-3">
                <div>
                  <Label className="required">Name: </Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    placeholder="Enter User Name"
                  />
                </div>{" "}
              </div>{" "}
              <div className="row mb-3">
                <div>
                  <Label className="required">Email:</Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    placeholder="Enter Email Address"
                  />
                </div>{" "}
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="required">Employee ID:</Label>{" "}
                  <Input
                    title="Enter 8 digits numbers only"
                    type="number"
                    className="borderall form_component_width_autodeploy"
                    onkeyup="this.value=this.value.replace(/[^0-9]/g,'');"
                    onChange={(event) => {
                      setEmp_ID(event.target.value);
                    }}
                    placeholder="Enter Employee ID "
                  />
                </div>{" "}
              </div>{" "}
              {err_msg !== "" ? (
                <div>
                  <span className="k-icon k-i-warning validationimage"> </span>{" "}
                  &nbsp; <Label className="validationmsg"> {err_msg} </Label>{" "}
                </div>
              ) : (
                <div> </div>
              )}
              <br />
              <div className="button-container button_right">
                <div>
                  <SaveButton icon="save" handleClick={createuser}>
                    Save
                  </SaveButton>
                  &nbsp; &nbsp;{" "}
                  <CancelButton icon="close" handleClick={handlecancel}>
                    Cancel
                  </CancelButton>
                </div>{" "}
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default AddUser;
