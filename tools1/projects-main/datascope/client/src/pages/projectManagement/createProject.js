import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { Link, useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import { SaveButton, CancelButton } from "../../components/Buttons/buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import AddNewTeamLead from "./addNewTeamLead";
import {
  create_projectmgmt_url,
  get_users_url,
  tenant_id,
  is_projectmgmt_exist,
} from "../../commonUtility/api_urls";
import {
  httpget,
  httppost,
  addnew_notifications,
} from "../../commonUtility/common_http";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";

loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/project_management",
    text: "Project Management",
  },
  {
    id: "create_project",
    route_url: "/create_project",
    text: "Create Project",
  },
];
const CreateProject = () => {
  const page_name = enMessages["cdp_notifications"]["page_projects"];
  const date_today = new Date();
  const AccountInfo = AccountInfoDetails();
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const [leadList, setLeadList] = useState(["Loading.."]);
  const [selectedLead, setSelectedLead] = useState(leadList[0]);
  const [openForm, setOpenForm] = React.useState(false);
  const [projectname, setprojectname] = useState("");
  const [status, setstatus] = useState(true);
  const [description, setdescription] = useState("");
  const [resourcegroup, setresourcegroup] = useState("");
  const [orgname, setorgname] = useState([]);
  const [err_msg, seterr_msg] = useState("");
  //const [value, setValue] = React.useState([]);
  const handlecancel = () => {
    history.push("/project_management");
  };
  const createprojects = () => {
    if (projectname === "" && description === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (projectname.length < 3) {
      seterr_msg("Enter Valid Project Name.");
    } else if (description.length < 15) {
      seterr_msg(
        "Enter Valid Project Details.Details should be Min 15 characters"
      );
    } else {
      const req_value = {
        params: {
          projectname: projectname,
          projid: "",
          page_type: "create",
        },
      };
      httpget(is_projectmgmt_exist, req_value).then((result) => {
        var proj_count = result[0].count;
        if (parseInt(proj_count) > 0) {
          seterr_msg(
            "Entered Project Name Already Exists. Please Enter Unique Project Name."
          );
        } else {
          const req_value = {
            params: {
              projectname: projectname,
              description: description,
              resourcegroup: resourcegroup,
              status: status,
              orgname: orgname,
              user_name: selectedLead,
              tenant_id: tenant_id,
              acc_details: AccountInfo["AccountMail"],
            },
          };
          httppost(create_projectmgmt_url, req_value).then((result) => {
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
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Create Another Project",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  setprojectname("");
                  setSelectedLead("Select Project Lead");
                  setdescription("");
                } else {
                  history.push("/project_management");
                }
              });
            }
          });
        }
      });
    }
  };

  const popUp = () => {
    setOpenForm(true);
  };
  const handleCancleAdd = () => {
    setOpenForm(false);
  };
  const handleSubmit = (lead_name) => {
    setLeadList((selectedLead) => [...selectedLead, lead_name]);
    setSelectedLead(lead_name);
    setTimeout(() => {
      setOpenForm(false);
    }, 1400);
  };

  useEffect(() => {
    const req_value = {
      params: {},
    };
    httpget(get_users_url, req_value).then((results) => {
      console.log(results);
      var lead_list = results.users.data.map(function (elem) {
        return elem.user_name;
      });
      setLeadList(lead_list);
      setSelectedLead("Select Project Lead");
    });
  }, []);

  const handleChange = (event) => {
    setSelectedLead(event.target.value);
  };

  // const Newteamlead = () => {
  //   history.push("/add_user");
  // };

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
              Create Project
            </h3>
          </div>
          <hr />
        </div>
        <div style={{ width: "80vw" }}>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="text-start form_left">
              <div className="row mb-3">
                <div>
                  <Label className="required" editorId="projects_name">
                    Project Name:
                  </Label>
                  <Input
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Project Name"
                    onChange={(e) => setprojectname(e.target.value)}
                    value={projectname}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="" editorId="project_description">
                    Description:
                  </Label>
                  <textarea
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Project Description"
                    onChange={(e) => setdescription(e.target.value)}
                    value={description}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="required">Team Lead: </Label>
                  <DropDownList
                    className="borderall form_component_width_autodeploy"
                    data={leadList}
                    value={selectedLead}
                    onChange={handleChange}
                  />
                  <div className="emptyline" />
                  <Button
                    // style={{ marginTop: -53, marginLeft: 480 }}
                    className="k-button k-primary"
                    id="btn"
                    icon="add"
                    // onClick={Newteamlead}
                    onClick={popUp}
                  >
                    Add New Team Lead
                  </Button>
                </div>
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="required">Start Date: </Label>
                  <DatePicker
                    className="borderall form_component_width_autodeploy"
                    defaultShow={false}
                    defaultValue={date_today}
                    disabled={true}
                  />
                </div>
              </div>
              {err_msg !== "" ? (
                <div>
                  <span className="k-icon k-i-warning validationimage"> </span>

                  <Label className="validationmsg"> {err_msg} </Label>
                </div>
              ) : (
                <div> </div>
              )}
              <br />
              <div className="button-container button_right">
                <div>
                  <SaveButton handleClick={createprojects} /> &nbsp; &nbsp;
                  <CancelButton handleClick={handlecancel} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {openForm && (
          <AddNewTeamLead onClose={handleCancleAdd} onSubmit={handleSubmit} />
        )}
      </div>
    </React.Fragment>
  );
};
export default CreateProject;
