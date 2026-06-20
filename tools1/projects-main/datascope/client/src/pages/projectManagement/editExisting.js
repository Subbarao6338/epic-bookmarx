import React, { useEffect, useState } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
import { Button } from "@progress/kendo-react-buttons";
import { process } from "@progress/kendo-data-query";
import {
  fetch_projectmgmt_url,
  tenant_id,
  update_projectmgmt_url,
  delete_projectmgmt_url,
  is_projectmgmt_exist,
} from "../../commonUtility/api_urls";
import {
  httpget,
  httpput,
  httpdelete,
  addnew_notifications,
} from "../../commonUtility/common_http";
import EditProject from "./editProject";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
var delayInMilliseconds = 1400;
loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/project_management",
    text: "Project Management",
  },
  {
    id: "edit_project",
    route_url: "/edit_project",
    text: "Edit Project",
  },
];
const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        className="k-button k-primary"
        id="btn"
        icon="edit"
        onClick={() => props.enterEdit(props.dataItem)}
      ></Button>
      &nbsp;&nbsp;
      <Button
        className="k-button k-primary"
        id="btn"
        icon="delete"
        onClick={() => props.enterDelete(props.dataItem)}
      ></Button>
    </td>
  );
};
const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};
const EditExisting = () => {
  //const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_projects"];
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const AccountInfo = AccountInfoDetails();
  const [data, setData] = React.useState([]);
  const [dataState, setDataState] = React.useState(initialDataState);
  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({ id: 1 });
  // const [value,setValue] = React.useState([]);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const enterEdit = (item) => {
    setOpenForm(true);
    // console.log(item);
    setEditItem(item);
  };
  const handleCancleEdit = () => {
    setOpenForm(false);
  };
  const handleEditSubmit = (event) => {
    const req_value = {
      params: {
        projid: event.projid,
        projectname: event.projectname,
        page_type: "edit",
      },
    };
    httpget(is_projectmgmt_exist, req_value).then((result) => {
      var proj_count = result[0].count;
      if (parseInt(proj_count) > 0) {
        event.errmsg =
          "Entered Project Name Already Exists. Please Enter Unique Project Name.";
        setOpenForm(true);
        setEditItem(event);
      } else {
        let newData = data.map((item) => {
          if (event.projid === item.projid) {
            item = { ...event };
            const req_value = {
              projid: event.projid,
              projectname: event.projectname,
              description: event.description,
              user_name: event.user_name,
              acc_details: AccountInfo["AccountMail"],
            };
            console.log(update_projectmgmt_url);
            console.log(req_value);
            httpput(update_projectmgmt_url, req_value).then((result) => {
              if (result.data === "Success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Project Updated Successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });
                const alert_type =
                  enMessages["cdp_notifications"]["alert_type_none"];
                const alert_msg =
                  '"' + event.projectname + '" Project Updated Successfully.';
                setTimeout(function () {
                  addnew_notifications(
                    AccountInfo["AccountName"],
                    AccountInfo["AccountMail"],
                    page_name,
                    alert_type,
                    alert_msg
                  );
                }, delayInMilliseconds);
              }
            });
          }
          return item;
        });
        setData(newData);
        setOpenForm(false);
      }
    });
  };
  // alert("Updated Successfully");
  // setOpenForm(false);
  const enterDelete = (item) => {
    console.log(item);
    Swal.fire({
      title: "Close the Project",
      text: "Are you sure you want to close this project as doing so will free up all the resources that have been assigned to this project",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Close the Project",
          icon: "warning",
          input: "text",
          text: "Please enter Project name",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Close Project",
          inputPlaceholder: "Enter your project name",
        }).then((result) => {
          if (result.isConfirmed) {
            const req_value = {
              params: { projectname: item.projectname },
            };
            if (item.projectname === result.value) {
              httpdelete(delete_projectmgmt_url, req_value).then((result) => {
                if (result.data === "Success") {
                  Swal.fire({
                    title: "Successfully Closed",
                    icon: "success",
                    text: "Deleted Project: " + item.projectname,
                    confirmButtonText: "Ok",
                  });
                  var after_delete = data
                    .filter((val) => val.projectname !== item.projectname)
                    .map((obj, i) => ({ ...obj, slno: i + 1 }));
                  setData(after_delete);
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Project Deletion Failed.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              });
            } else {
              // alert("hi");
              Swal.fire({
                title: "Please Try Again",
                icon: "error",
                text: "Project name doesn’t match",
              });
            }
          }
        });
      }
    });
  };

  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  );
  const MyTimeCell = (props) => {
    // console.log(props);
    return (
      <td>{new Date(props.dataItem.created_on).toLocaleDateString()}</td>
      //   <td>{props.dataItem.created_on}</td>
    );
  };
  useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };
    httpget(fetch_projectmgmt_url, req_value).then((results) => {
      setData(results.projects.data);
      //setData(results);
      // console.log(results.projectmgmt.data);
    });
  }, []);
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
              Edit Project
            </h3>
          </div>
          <hr />
        </div>
        <div style={{ maxWidth: 1200 }}>
          <Grid
            pageable={true}
            sortable={true}
            filterable={true}
            data={process(data, dataState)}
            {...dataState}
            onDataStateChange={(e) => {
              setDataState(e.dataState);
            }}
          >
            <Column field="slno" title="S.No" width="60px" filterable={false} />
            <Column
              field="projectname"
              title="Project"
              width="200px"
              // filterable={false}
            />
            <Column
              field="description"
              title="Description"
              width="280px"
              filterable={true}
            />
            <Column
              field="user_name"
              title="Team Lead"
              width="180px"
              filterable={true}
            />

            <Column
              field="status"
              title="Status"
              width="150px"
              filterable={true}
            />

            <Column
              field="created_on"
              title="Start Date"
              width="150px"
              filterable={false}
              cell={MyTimeCell}
            />
            <Column
              field="action"
              cell={MyEditCommandCell}
              title="Action"
              width="120px"
              filterable={false}
            />
          </Grid>
          {openForm && (
            <EditProject
              cancelEdit={handleCancleEdit}
              onSubmit={handleEditSubmit}
              item={editItem}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default EditExisting;
