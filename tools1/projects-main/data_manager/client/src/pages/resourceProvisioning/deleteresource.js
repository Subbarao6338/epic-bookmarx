import * as React from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import {
  httpget,
  httpdelete,
  httpput,
  addnew_notifications,
} from "./../../commonUtility/common_http";
import {
  fetch_project_resource_url,
  delete_project_resource_url,
  delete_allproject_resource_url,
  update_project_resource_url,
  delete_selected_config_url,
  getvalidationforclear,
  tenant_id,
} from "./../../commonUtility/api_urls";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "./../../messages/en-US";
import { Button } from "@progress/kendo-react-buttons";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";
import EditResource from "./editResource";
import { Checkbox } from "@progress/kendo-react-inputs";

loadMessages(enMessages, "en-US");
var delayInMilliseconds = 1400;
const navitems = [
  {
    id: "home",
    route_url: "/dpadminresource",
    text: "Resource Provisioning",
  },
  {
    id: "resource",
    route_url: "/deleteresource",
    text: "Clear Configurations",
  },
];

const EditCommandCell = (props) => {
  return (
    <td>
      &nbsp;
      <Button
        className="k-button k-primary"
        id="btn"
        icon="apply-format"
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

const Deleteresource = () => {
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_projects"];

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [data, setData] = React.useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState([]);
  const [selectedProjectName, setSelectedProjectName] = React.useState([]);

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    };

    console.log(fetch_project_resource_url);
    httpget(fetch_project_resource_url, req_value).then((result) => {
      console.log(result);
      setData(result);
    });
  }, []);

  const [dataState, setDataState] = React.useState(initialDataState);
  const [msg, setMsg] = React.useState();

  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages["cdp_swal_msg"]["dlt_title"],
      text: item.aksnodesallowedvmtype,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: { id: item.id },
        };

        console.log(delete_project_resource_url);
        httpdelete(delete_project_resource_url, req_value).then((result) => {
          if (result.data === "Success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Resource Deleted Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];
            const alert_msg =
              '"' +
              item.aksnodesallowedvmtype +
              '" Resource Deleted Successfully.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            setTimeout(function () {
              window.location.reload();
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' + item.aksnodesallowedvmtype + '" Resource Deletion Failed.';
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
              title: "Resource Deletion Failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };

  const DeleteAll = (item) => {
    Swal.fire({
      title: enMessages["cdp_delete_msg"]["dlt_title"],
      text: item.aksnodesallowedvmtype,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(delete_allproject_resource_url);
        httpdelete(delete_allproject_resource_url).then((result) => {
          if (result.data === "Success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: " Resources Deleted Successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_none"];
            const alert_msg =
              '"' +
              item.aksnodesallowedvmtype +
              '"Resource Deleted Successfully.';
            addnew_notifications(
              AccountInfo["AccountName"],
              AccountInfo["AccountMail"],
              page_name,
              alert_type,
              alert_msg
            );
            setTimeout(function () {
              window.location.reload();
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' + item.aksnodesallowedvmtype + '"Resource Deletion Failed.';
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
              title: "Resource Deletion Failed.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };

  const MyEditCommandCell = (props) => (
    <EditCommandCell {...props} enterDelete={enterDelete} />
  );

  const handleCheckboxClick = (projid, proj_name, val) => {
    if (val) {
      selectedCheckboxes.push(projid);
      selectedProjectName.push(proj_name);
    } else {
      const index = selectedCheckboxes.indexOf(projid);
      if (index > -1) {
        selectedCheckboxes.splice(index, 1);
      }
      const index2 = selectedProjectName.indexOf(proj_name);
      if (index2 > -1) {
        selectedProjectName.splice(index2, 1);
      }
    }
  };

  const ClearSelectedConfig = () => {
    if (selectedCheckboxes.length !== 0) {
      const req_value = {
        params: { selected_proj_ids: selectedCheckboxes.toString() },
      };

      httpget(getvalidationforclear, req_value).then((result) => {
        if (result.count === 0) {
          console.log(selectedProjectName);
          Swal.fire({
            title: "Are you sure want to clear the selected configurations ?",
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
                inputPlaceholder:
                  "Enter your project name (',' separated if multiple)",
              }).then((result) => {
                if (result.isConfirmed) {
                  const req_value = {
                    params: {
                      selected_proj_ids: selectedCheckboxes.toString(),
                      selected_project_names: selectedProjectName.toString(),
                      user_input: result.value,
                    },
                  };
                  httpdelete(delete_selected_config_url, req_value).then(
                    (result) => {
                      if (result.data === "Success") {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title:
                            "Selected Configurations Cleared Successfully.",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        const alert_type =
                          enMessages["cdp_notifications"]["alert_type_none"];
                        const alert_msg =
                          "Selected Configurations Cleared Successfully.";
                        addnew_notifications(
                          AccountInfo["AccountName"],
                          AccountInfo["AccountMail"],
                          page_name,
                          alert_type,
                          alert_msg
                        );
                        var after_delete = data
                          .filter((val) => !selectedProjectName.includes(val.projectname))
                          .map((obj, i) => ({ ...obj, slno: i + 1 }));
                        setData(after_delete);
                        console.log(after_delete);
                      } else if (result.data === "Not Matched") {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: "Project Name not Matched.",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      } else {
                        const alert_type =
                          enMessages["cdp_notifications"]["alert_type_error"];
                        const alert_msg =
                          "Selected Configurations Clearing Failed.";
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
                          title: "Selected Configurations Deletion Failed.",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }
                    }
                  );
                }
              });
            }
          });
        } else {
          Swal.fire({
            title:
              "Selected projects have some provisioned Clusters, Please delete/destroy before clearing configuration.",
            icon: "warning",
          });
        }
      });
    } else {
      setMsg("Please select atleast one configuration.");
    }
  };

  const MyCheckBoxCell = (props) => {
    console.log(props);
    return (
      <td>
        <Checkbox
          key={props.dataItem.slno}
          onChange={(e) => {
            handleCheckboxClick(
              props.dataItem.projid,
              props.dataItem.projectname,
              e.target.value
            );
          }}
        />
      </td>
    );
  };

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
            <br />
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.deleteResource}
            </h3>
          </div>
          <hr />

          <div className="text-start">
            <Button icon="apply-format" id="btn" onClick={DeleteAll}>
              Clear All Configurations
            </Button>
            &nbsp;&nbsp;
            <Button icon="apply-format" id="btn" onClick={ClearSelectedConfig}>
              Clear Selected Configurations
            </Button>
            &nbsp;&nbsp;
            <p
              style={{
                color: "red",
              }}
            >
              {msg}
            </p>
          </div>
          <br />
          <div style={{ maxWidth: 1170 }}>
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
              <Column
                field="*"
                title="*"
                width="60px"
                filterable={false}
                cell={MyCheckBoxCell}
              />
              <Column
                field="slno"
                title="S.No"
                width="60px"
                filterable={false}
              />
              <Column
                field="projectname"
                title="Project Name"
                width="200px"
                filterable={true}
              />
              <Column
                field="aksnodesallowedvmtype"
                title="VM Type"
                width="250px"
                filterable={true}
              />

              <Column
                field="aksallowedregions"
                title="Region"
                width="250px"
                filterable={true}
              />

              <Column
                field="aksclusterallocatedcount"
                title="Kubernetes Cluster"
                width="170px"
                filterable={true}
              />

              <Column
                field="aksnodesmaxlimit"
                title="Node Max Limit"
                width="150px"
                filterable={true}
              />

              {/* <Column
                field="action"
                cell={MyEditCommandCell}
                title="Clear"
                width="70px"
                filterable={false}
              /> */}
            </Grid>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Deleteresource;
