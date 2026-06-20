import React, { useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  autodeploy_url,
  autodestroy_url,
  logs_url,
  getkubernetes_cluster_url,
} from "../commonUtility/api_urls";
import { httpget } from "../commonUtility/common_http";
loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "deploy_airflow",
    route_url: "/airflow",
    text: "Airflow",
  },
];
const Airflow = () => {
  //const AccountInfo = AccountInfoDetails();
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const cluster = ["Kubernetes Cluster", "App Service", "VM"];

  const [resourcename, setresourcename] = useState("");
  const [resourcelocation, setresourcelocation] = useState("");
  const [selectedkubernetes, setSelectedkubernetes] =
    useState("Select Kubernetes");
  const [selected_aksid, setselected_aksid] = useState("");
  const [deploymentType, setdeploymentType] = useState("Kubernetes Cluster");
  const [adminuser, setadminuser] = useState("admin");
  const [adminpassword, setadminpassword] = useState("admin");

  const [logdetails, setLogDetails] = useState("");

  const [kubernetesdetails, setKubernetesDetails] = useState();
  const [kubernetes, setKubernetes] = useState();

  React.useEffect(() => {
    const req_value = {};
    httpget(getkubernetes_cluster_url, req_value).then((result) => {
      console.log(result[0]["kubernetes_name"]);
      setKubernetesDetails(result);
      const arrKubernetes = result.map(
        (kubernetscluster) => kubernetscluster.kubernetes_name
      );
      setKubernetes(arrKubernetes);
    });
  }, []);

  const [err_msg, seterr_msg] = useState("");
  const createDeploy = () => {
    setLogDetails("");
    console.log("click");
    if (selectedkubernetes === "Select Kubernetes") {
      seterr_msg("Select Anyone Kubernetes.");
    } else if (deploymentType === "") {
      seterr_msg("Select Anyone Deployment Type.");
    } else if (adminuser === "") {
      seterr_msg("Enter Admin User Name.");
    } else if (adminpassword === "") {
      seterr_msg("Enter Admin Password.");
    } else {
      const req_value = {
        params: {
          resource_name: resourcename,
          resource_location: resourcelocation,
          kubernetes_id: selected_aksid,
          kubernetes_name: selectedkubernetes,
          deploymentType: deploymentType,
          adminuser: adminuser,
          adminpassword: adminpassword,
          page_type: "airflow",
        },
      };
      console.log(req_value);
      httpget(autodeploy_url, req_value).then((result) => {
        console.log(result);
      });
    }
  };
  ///destroy
  const destroy = () => {
    setLogDetails("");
    console.log("click");
    const req_value = {
      params: {
        resource_name: resourcename,
        resource_location: resourcelocation,
        kubernetes_id: selected_aksid,
        kubernetes_name: selectedkubernetes,
        deploymentType: deploymentType,
        adminuser: adminuser,
        adminpassword: adminpassword,
        page_type: "airflow",
      },
    };
    console.log(req_value);
    httpget(autodestroy_url, req_value).then((result) => {
      console.log(result);
    });
  };

  /////Deploy Logs

  const logs = () => {
    console.log("click");
    const req_value = {
      params: {},
    };
    console.log(req_value);
    httpget(logs_url, req_value).then((result) => {
      console.log(result["logs"]);
      console.log(result["logs"].length);
      //setLogDetails(JSON.stringify(result["logs"]));
      setLogDetails(result["logs"]);
    });
  };

  const handleKubernetesChange = (event) => {
    setSelectedkubernetes(event.target.value);
    const search = (kubernetesdetails) =>
      kubernetesdetails.kubernetes_name === event.target.value;
    const index_val = kubernetesdetails.findIndex(search);
    console.log(index_val);
    setselected_aksid(kubernetesdetails[index_val]["kubernetesid"]);
    setresourcename(kubernetesdetails[index_val]["resource_name"]);
    setresourcelocation(kubernetesdetails[index_val]["resource_location"]);
  };

  const handleDeploymentTypeChange = (event) => {
    setdeploymentType(event.target.value);
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
            <h3 id="heading" align="left">
              {enMessages.cdp_menus.airflow}
            </h3>
          </div>
          <hr />
        </div>
        <br />
        <div style={{ width: "80vw" }}>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="buttoncontainer" style={{ marginLeft: -47 }}>
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton" onClick={createDeploy}>
                  Deploy
                </Button>
              </div>
              &nbsp;
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton " onClick={destroy}>
                  Delete
                </Button>
              </div>
              &nbsp;
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton" onClick={logs}>
                  Logs
                </Button>
              </div>
            </div>
            <div className="text-start form_left">
              <div className="row mb-3">
                <div>
                  <Label className="required">
                    Kubernetes Cluster: &nbsp;{" "}
                  </Label>{" "}
                  <DropDownList
                    className="borderall form_component_width_autodeploy"
                    data={kubernetes}
                    value={selectedkubernetes}
                    onChange={handleKubernetesChange}
                  />{" "}
                </div>{" "}
              </div>
              {resourcename !== "" && resourcelocation !== "" ? (
                <div className="row mb-3">
                  <div>
                    <Label>Resource Group Name (Location): </Label>
                    <Input
                      className="borderall form_component_width_autodeploy"
                      value={resourcename + " (" + resourcelocation + ")"}
                      disabled={true}
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div className="row mb-3">
                <div>
                  <Label className="required">Deployment Type&nbsp; </Label>{" "}
                  <DropDownList
                    className="borderall form_component_width_autodeploy"
                    data={cluster}
                    value={deploymentType}
                    onChange={handleDeploymentTypeChange}
                  />{" "}
                </div>{" "}
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="required">Admin User Name: &nbsp; </Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Admin User Name"
                    value={adminuser}
                    onChange={(event) => {
                      setadminuser(event.target.value);
                    }}
                  />
                </div>{" "}
              </div>{" "}
              <div className="row mb-3">
                <div>
                  <Label className="required">Admin Password: &nbsp; </Label>{" "}
                  <Input
                    type="password"
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Admin password"
                    value={adminpassword}
                    onChange={(event) => {
                      setadminpassword(event.target.value);
                    }}
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
            </div>
          </div>
        </div>
        <div style={{ width: "40vw", float: "right" }}>
          {logdetails !== "" ? (
            <Label
              className="logslabel scroll"
              style={{ whiteSpace: "pre-line", height: 400 }}
            >
              <b style={{ color: "green" }}> Console Log Details</b>
              {logdetails}
            </Label>
          ) : (
            <Label></Label>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Airflow;
