import * as React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory, useLocation } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import {
  httpget,
  httpdelete,
  addnew_notifications,
} from "../../commonUtility/common_http";
import {
  getresources_projectbased_url,
  getkubernetes_projectbased_url,
  getprovisionedresource_projectbased_url,
  delete_kubernetescluster_url,
  autodestroy_url,
} from "../../commonUtility/api_urls";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Label } from "@progress/kendo-react-labels";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox } from "@progress/kendo-react-inputs";
import Swal from "sweetalert2";
loadMessages(enMessages, "en-US");

const initialDataState = {
  sort: [{ field: "code", dir: "asc" }],
  take: 5,
  skip: 0,
};

const ProvisionedResourceDetails = () => {
  const location = useLocation();
  const { proj_id } = location.state;
  const { proj_name } = location.state;
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
      id: "provisioned_resourcedetails",
      route_url: "/provisioned_resourcedetails",
      text: "Provisioned Resource",
    },
  ];

  const AccountInfo = AccountInfoDetails();
  const AccountMail = AccountInfo["AccountMail"];
  const page_name = "Provisioned Resources";

  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push({
      pathname: navdata[itemIndex]["route_url"],
      state: { proj_id: proj_id, proj_name: proj_name },
    });
  };

  const [resourceDetails, setResourceDetails] = React.useState([]);
  const [kubernetesDetails, setKubernetesDetails] = React.useState([]);
  const [provisionedresourceDetails, setProvisionedResourceDetails] =
    React.useState([]);

  const [dataState, setDataState] = React.useState(initialDataState);

  React.useEffect(() => {
    const req_value = {
      params: { proj_id: proj_id },
    };

    console.log(getresources_projectbased_url);
    httpget(getresources_projectbased_url, req_value).then((result) => {
      console.log(result);
      setResourceDetails(result);
    });

    httpget(getkubernetes_projectbased_url, req_value).then((result) => {
      console.log(result);
      setKubernetesDetails(result);
    });

    httpget(getprovisionedresource_projectbased_url, req_value).then(
      (result) => {
        console.log(result);
        setProvisionedResourceDetails(result);
      }
    );
  }, []);

  const handleKubesDelete = (props) => {
    Swal.fire({
      title: "Are you sure want to delete this Kubernetes Cluster ?",
      text: props.dataItem.kubernetes_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: {
            resource_name: props.dataItem.resource_name,
            selectedresource_location: props.dataItem.resource_location,
            selectedaks_nodes_vm_type: props.dataItem.aks_nodes_vm_type,
            node_count: props.dataItem.node_count,
            kubernetes_name: props.dataItem.kubernetes_name,
            proj_id: proj_id,
            page_type: "kubernetes",
          },
        };
        httpget(autodestroy_url, req_value).then((result) => {
          httpdelete(delete_kubernetescluster_url, req_value).then((result) => {
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
                props.dataItem.resource_name +
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
              }, 1400);
            } else {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_error"];
              const alert_msg =
                '"' +
                props.dataItem.resource_name +
                '" Resource Deletion Failed.';
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
        });
      }
    });
  };

  const handleKubesLogs = (props) => {};

  const handleResourceDelete = (props) => {
    console.log(props);
    Swal.fire({
      title: "Are you sure want to delete this resource ?",
      text:
        props.dataItem.kubernetes_name +
        " & " +
        props.dataItem.deployed_resource,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: {
            resource_name: props.dataItem.resource_name,
            kubernetes_id: props.dataItem.kubernetesid,
            kubernetes_name: props.dataItem.kubernetes_name,
            deploymentType: props.dataItem.deployment_type,
            page_type: props.dataItem.deployed_resource,
            deployed_resource: props.dataItem.deployed_resource,
          },
        };
        httpget(autodestroy_url, req_value).then((result) => {
          if (result.msg === "Success") {
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
              props.dataItem.deployed_resource +
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
            }, 1400);
          } else {
            const alert_type =
              enMessages["cdp_notifications"]["alert_type_error"];
            const alert_msg =
              '"' +
              props.dataItem.deployed_resource +
              '" Resource Deletion Failed.';
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
  const handleResourceLogs = (props) => {};

  const [selected, setSelected] = React.useState(0);
  const handleSelect = (e) => {
    setSelected(e.selected);
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
            <h3 align="left" id="heading">
              Provisioned Resource Details
            </h3>
          </div>
          <hr />

          <TabStrip selected={selected} onSelect={handleSelect}>
            <TabStripTab title="Allocated Resources">
              <Grid
                style={{
                  height: "100px",
                }}
                data={resourceDetails}
              >
                <GridColumn
                  field="aksclusterallocatedcount"
                  title="Cluster Allocated Count"
                  width="200px"
                />
                <GridColumn
                  field="aksnodesmaxlimit"
                  title="Nodes Max Limit"
                  width="150px"
                />
                <GridColumn
                  field="aks_cluster_provisioned_count"
                  title="Cluster Provisioned Count"
                  width="220px"
                />
                <GridColumn
                  field="aksnodesallowedvmtype"
                  title="Allowed Vms"
                  width="300px"
                />
                <GridColumn
                  field="aksallowedregions"
                  title="Allowed Regions"
                  width="200px"
                />
              </Grid>
            </TabStripTab>
            <TabStripTab title="Kubernetes Cluster">
              <Grid
                pageable={true}
                sortable={true}
                filterable={true}
                data={process(kubernetesDetails, dataState)}
                {...dataState}
                onDataStateChange={(e) => {
                  setDataState(e.dataState);
                }}
              >
                <GridColumn
                  field="slno"
                  title="S.No"
                  width="60px"
                  filterable={false}
                />
                <GridColumn
                  field="kubernetes_name"
                  title="Kubernetes Name"
                  width="250px"
                />
                <GridColumn
                  field="resource_name"
                  title="Resource Name"
                  width="250px"
                />
                <GridColumn
                  field="resource_location"
                  title="Resource Location"
                  width="180px"
                />
                <GridColumn
                  field="node_count"
                  title="Node Count"
                  width="120px"
                  filterable={false}
                />
                <GridColumn
                  field="aks_nodes_vm_type"
                  title="VM Types"
                  width="150px"
                  filterable={false}
                />
                <GridColumn
                  field="action"
                  title="Delete"
                  width="100px"
                  filterable={false}
                  cell={(props) => (
                    <td>
                      <Button
                        className="k-button k-primary"
                        id="btn"
                        icon="delete"
                        onClick={() => handleKubesDelete(props)}
                      ></Button>
                      &nbsp;&nbsp;
                      <Button
                        className="k-button k-primary"
                        id="btn"
                        icon="js"
                        onClick={handleKubesLogs}
                      ></Button>
                    </td>
                  )}
                />
              </Grid>
            </TabStripTab>
            <TabStripTab title="Provisioned Resources">
              <Grid
                pageable={true}
                sortable={true}
                filterable={true}
                data={process(provisionedresourceDetails, dataState)}
                {...dataState}
                onDataStateChange={(e) => {
                  setDataState(e.dataState);
                }}
              >
                <GridColumn
                  field="slno"
                  title="S.No"
                  width="60px"
                  filterable={false}
                />
                <GridColumn
                  field="kubernetes_name"
                  title="Kubernetes Name"
                  width="250px"
                />
                <GridColumn
                  field="deployed_resource"
                  title="Resource Name"
                  width="150px"
                />
                <GridColumn
                  field="deployment_type"
                  title="Deployment Type"
                  width="180px"
                />
                <GridColumn
                  field="resource_details"
                  title="Resource Details"
                  filterable={false}
                />
                <GridColumn
                  field="action"
                  title="Delete"
                  width="100px"
                  filterable={false}
                  cell={(props) => (
                    <td>
                      <Button
                        className="k-button k-primary"
                        id="btn"
                        icon="delete"
                        onClick={() => handleResourceDelete(props)}
                      ></Button>
                      &nbsp;&nbsp;
                      <Button
                        className="k-button k-primary"
                        id="btn"
                        icon="js"
                        onClick={handleResourceLogs}
                      ></Button>
                    </td>
                  )}
                />
              </Grid>
            </TabStripTab>
          </TabStrip>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProvisionedResourceDetails;
