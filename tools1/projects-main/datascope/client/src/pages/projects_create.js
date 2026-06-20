import React, { useState } from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { SaveButton, CancelButton } from "./../components/Buttons/buttons";
import { Switch, Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useHistory } from "react-router-dom";
import {
  httppost,
  httpget,
  addnew_notifications,
} from "./../commonUtility/common_http";
import {
  create_projects_url,
  tenant_id,
  fetch_organization_url,
  is_project_exist,
} from "./../commonUtility/api_urls";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
loadMessages(enMessages, "en-US");

// const defaultValue = new Date()

const navitems = [
  {
    id: "home",
    route_url: "/home",
    text: "Home",
  },
  {
    id: "projectssummary",
    route_url: "/projects_summary",
    text: "Projects Summary",
  },
  {
    id: "projectscreate",
    route_url: "/projects_create",
    text: " Create Project",
  },
];

function Projects() {
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_projects"];

  const history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [projectname, setprojectname] = useState("");
  const [details, setdetails] = useState("");
  const [resourcegroup, setresourcegroup] = useState("");
  const [status, setstatus] = useState(true);
  const [orgname, setorgname] = useState([]);

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };

    console.log(fetch_organization_url);
    httpget(fetch_organization_url, req_value).then((result) => {
      console.log(result);
      console.log(result.length);
      var arr = [];
      for (var i = 0; i < result.length; i++) {
        arr.push(result[i]["name"]);
      }
      console.log(arr);
      setorgname(arr);
    });
  }, []);

  const [value, setValue] = React.useState("Select Organization");
  const [err_msg, seterr_msg] = useState("");
  // const creation_date = new Date()

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handlecancel = () => {
    history.push("/projects_summary");
  };

  const createprojects = () => {
    console.log("click");
    if (
      projectname === "" &&
      details === "" &&
      resourcegroup === "" &&
      value === "Select Organization"
    ) {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (projectname.length < 3) {
      seterr_msg("Enter Valid Project Name.");
    } else if (details.length < 3) {
      seterr_msg("Enter Valid Project Details");
    } else if (resourcegroup.length < 3) {
      seterr_msg("Enter Valid Project resourcegroup");
    } else if (value === "Select Organization") {
      seterr_msg("Please select Organization Name.");
    } else {
      const req_value = {
        params: {
          projectname: projectname,
          projid: "",
          page_type: "create",
        },
      };

      httpget(is_project_exist, req_value).then((result) => {
        var proj_count = result[0].count;
        if (parseInt(proj_count) > 0) {
          seterr_msg(
            "Entered Project Name Already Exists. Please Enter Unique Project Name."
          );
        } else {
          const req_value = {
            params: {
              projectname: projectname,
              details: details,
              resourcegroup: resourcegroup,
              status: status,
              orgname: value,
              tenant_id: tenant_id,
              acc_details: AccountInfo["AccountMail"],
            },
          };

          console.log(req_value);
          httppost(create_projects_url, req_value).then((result) => {
            if (result.data === "Success") {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_none"];
              const alert_msg =
                '"' + projectname + '" Project Created Successfully.';
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Project Created Successfully.",
                showConfirmButton: false,
                timer: 1500,
              });
              history.push("/projects_summary");
            } else {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_error"];
              const alert_msg =
                '"' + projectname + '" Project Creation Failed.';
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Project Creation Failed.",
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
    <div>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />
      <div>
        <div>
          <div>
            <h3 align="left" id="heading">
              {" "}
              {enMessages.cdp_menus.projectscreate}{" "}
            </h3>{" "}
          </div>{" "}
          <hr />
          <div className="text-start form_left">
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="projects_name">
                  Project Name: &nbsp;{" "}
                </Label>{" "}
                <Input
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setprojectname(event.target.value);
                  }}
                  placeholder="Enter Project Name"
                />
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="details">
                  Details: &nbsp;{" "}
                </Label>{" "}
                <textarea
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setdetails(event.target.value);
                  }}
                  placeholder="Enter Details"
                />
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="resourcegroup">
                  Resource Group: &nbsp;{" "}
                </Label>{" "}
                <textarea
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setresourcegroup(event.target.value);
                  }}
                  placeholder="Enter Details"
                />
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="Status">
                  Status: &nbsp;{" "}
                </Label>{" "}
                <br />
                <Switch
                  className="borderall switch_width"
                  onLabel={"Active"}
                  offLabel={"InActive"}
                  defaultChecked={status}
                  onChange={(event) => {
                    setstatus(event.target.value);
                  }}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="orgname">
                  Organization Name: &nbsp;{" "}
                </Label>{" "}
                <DropDownList
                  className="borderall form_component_width"
                  data={orgname}
                  value={value}
                  onChange={handleChange}
                />{" "}
              </div>{" "}
            </div>
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
                <SaveButton handleClick={createprojects} /> &nbsp; &nbsp;{" "}
                <CancelButton handleClick={handlecancel} />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Projects;
