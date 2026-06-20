import React, { useEffect } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "./../../messages/en-US";
import ReactTooltip from "react-tooltip";
import { Button } from "@progress/kendo-react-buttons";
import { process } from "@progress/kendo-data-query";
import {
  fetch_projectmgmt_url,
  tenant_id,
  delete_project_resource_url,
} from "./../../commonUtility/api_urls";
import {
  httpget,
  httpdelete,
  addnew_notifications,
} from "./../../commonUtility/common_http";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";
import EditResource from "./editResource";
import Swal from "sweetalert2";

loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "projectresource",
    route_url: "/assignresource",
    text: "Configure Resources",
  },
];

const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};
const Projectresource = () => {
  const AccountInfo = AccountInfoDetails();
  const AccountRole = AccountInfo["AccountRole"];
  const page_name = "Resource Cofiguration";
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const [data, setData] = React.useState([]);
  const [dataState, setDataState] = React.useState(initialDataState);
  const [openForm, setOpenForm] = React.useState(false);
  const [editItem, setEditItem] = React.useState({ id: 1 });

  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const MyTimeCell = (props) => {
    return <td>{new Date(props.dataItem.created_on).toLocaleDateString()}</td>;
  };

  const ConfigureCommandCell = (props) => {
    return (
      <td>
        &nbsp;
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

  const enterEdit = (item) => {
    setOpenForm(true);
    setEditItem(item);
  };

  const enterDelete = (item) => {
    // alert(item.projid)
    Swal.fire({
      title: enMessages["cdp_swal_msg"]["dlt_cofigured_resources"],
      text: item.projectname,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Clear the Project Configuration",
          icon: "warning",
          input: "text",
          text: "Please enter Project name",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Clear Configuration",
          inputPlaceholder: "Enter your project name",
        }).then((result) => {
          if (item.projectname === result.value) {
            const req_value = {
              params: { id: item.projid },
            };
            httpdelete(delete_project_resource_url, req_value).then(
              (result) => {
                if (result.data === "Success") {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Configuration Cleared Successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  const alert_type =
                    enMessages["cdp_notifications"]["alert_type_none"];
                  const alert_msg =
                    'Configuration for Project "' +
                    item.projectname +
                    '" Cleared Successfully.';
                  addnew_notifications(
                    AccountInfo["AccountName"],
                    AccountInfo["AccountMail"],
                    page_name,
                    alert_type,
                    alert_msg
                  );
                  item.aksnodesmaxlimit = "None";
                  item.aksnodesallowedvmtype = "None";
                  item.aksclusterallocatedcount = "None";
                  item.aksallowedregions = "None";
                } else {
                  const alert_type =
                    enMessages["cdp_notifications"]["alert_type_error"];
                  const alert_msg =
                    'Configured Resource Clearing Failed for Project "' +
                    item.projectname +
                    '"';
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
                    title: "Resource Clearing Failed.",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              }
            );
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Project Name not Matched.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };

  const handleCancleEdit = (props) => {
    setOpenForm(false);
  };

  const MyConfigureCommandCell = (props) => (
    <ConfigureCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  );

  useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };
    httpget(fetch_projectmgmt_url, req_value).then((results) => {
      setData(results.projects.data);
    });
  }, []);

  return AccountRole === "DP Admin" ? (
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
              Configure Resources
            </h3>
          </div>
          <hr />
        </div>
        <br />
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
              width="300px"
              filterable={true}
            />

            <Column
              field="user_name"
              title="Project Lead"
              width="300px"
              filterable={true}
            />

            <Column
              field="created_on"
              title="Start Date"
              width="300px"
              filterable={true}
              cell={MyTimeCell}
            />
            <Column
              field="action"
              title="Configure"
              filterable={false}
              width="150px"
              cell={MyConfigureCommandCell}
              // cell={(props) => (
              //   <td>
              //     <Button
              //       className="k-button k-primary"
              //       id="btn"
              //       icon="plus"
              //       onClick={() =>
              //         history.push({
              //           pathname: "/addresource",
              //           state: {
              //             proj_id: props.dataItem.projid,
              //           },
              //         })
              //       }
              //     ></Button>
              //     &nbsp;&nbsp;
              //     <Button
              //       className="k-button k-primary"
              //       id="btn"
              //       icon="edit"
              //       onClick={() =>
              //         history.push({
              //           state: {
              //             proj_id: props.dataItem.projid,
              //           },
              //         })
              //       }
              //     ></Button>
              //     &nbsp;&nbsp;
              //     <Button
              //       className="k-button k-primary"
              //       id="btn"
              //       icon="delete"
              //       onClick={() =>
              //         history.push({
              //           state: {
              //             proj_id: props.dataItem.projid,
              //           },
              //         })
              //       }
              //     ></Button>
              //   </td>
              // )}
            />
          </Grid>
          {openForm && (
            <EditResource cancelEdit={handleCancleEdit} item={editItem} />
          )}
          <style>
            {`.k-animation-container {
              z-index: 10003;
              }`}
          </style>
        </div>
      </div>
    </React.Fragment>
  ) : (
    <>Access Denied</>
  );
};
export default Projectresource;
