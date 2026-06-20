import * as React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory, useLocation } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../../messages/en-US";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { httpget } from "../../commonUtility/common_http";
import {
  getresources_projectbased_url,
  getkubernetes_projectbased_url,
  getprovisionedresource_projectbased_url,
} from "../../commonUtility/api_urls";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Label } from "@progress/kendo-react-labels";
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
              width="300px"
            />
          </Grid>
          <br />
          <div classname="titlecolor" style={{ float: "left" }}>
            <Label>
              <b>Kubernetes Cluster Details :</b>
            </Label>
          </div>
          <br />
          <br />
          {/* Kubernetes Details */}
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
              width="80px"
              filterable={false}
            />
            <GridColumn
              field="kubernetes_name"
              title="Kubernetes Name"
              width="350px"
            />
            <GridColumn
              field="resource_name"
              title="Resource Name"
              width="320px"
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
              field="node_count"
              title="VM Size Count"
              width="150px"
              filterable={false}
            />
          </Grid>

          <br />
          <div classname="titlecolor" style={{ float: "left" }}>
            <Label>
              <b>Provisioned Resource Details :</b>
            </Label>
          </div>
          <br />
          <br />
          {/* Provisioned Resource Details */}
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
              width="80px"
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
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProvisionedResourceDetails;
