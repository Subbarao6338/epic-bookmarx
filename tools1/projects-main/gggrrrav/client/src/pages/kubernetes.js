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
  create_kubernetescluster_url,
  delete_kubernetescluster_url,
} from "../commonUtility/api_urls";
import { httpdelete, httpget, httppost } from "../commonUtility/common_http";
import location from "./location.json";
loadMessages(enMessages, "en-US");
const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "deploy_kubernetes",
    route_url: "/kubernetes",
    text: "Kubernetes Cluster",
  },
];
const Kubernetes = () => {
  //const AccountInfo = AccountInfoDetails();
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const handleChange = (event) => {
    setresource_location(event.target.value);
  };

  const [resource_name, setresource_name] = useState("Graviton_kubernetes");
  const [resource_location, setresource_location] = useState("Central India");
  const [node_count, setnode_count] = useState("2");
  const [status, setstatus] = useState("Completed");
  const [logdetails, setLogDetails] = useState("");
  const [err_msg, seterr_msg] = useState("");
  const createdeploy = () => {
    setLogDetails("");
    console.log("click");
    if (resource_name === "" && node_count === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (resource_name === "") {
      seterr_msg("Enter Valid Resource Name.");
    } else if (node_count === "") {
      seterr_msg("Enter Node count");
    } else {
      const req_value = {
        params: {
          resource_name: resource_name,
          resource_location: resource_location,
          node_count: node_count,
          kubernetes_name: resource_name + "_aks",
          page_type: "kubernetes",
          status: status,
        },
      };
      console.log(req_value);
      httpget(autodeploy_url, req_value).then((result) => {});
      console.log(autodeploy_url);
      httppost(create_kubernetescluster_url, req_value).then((result) => {});
      console.log(create_kubernetescluster_url);
    }
  };

  const destroy = () => {
    setLogDetails("");
    console.log("click");
    const req_value = {
      params: {
        resource_name: resource_name,
        resource_location: resource_location,
        node_count: node_count,
        kubernetes_name: resource_name + "_aks",
        page_type: "kubernetes",
      },
    };
    console.log(req_value);
    httpget(autodestroy_url, req_value).then((result) => {
      //console.log(result);
    });
    httpdelete(delete_kubernetescluster_url, req_value).then((result) => {});
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
      setLogDetails(result["logs"]);
    });
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
              {enMessages.cdp_menus.kubernetes}
            </h3>
          </div>
          <hr />
        </div>
        <br />
        <div style={{ width: "80vw" }}>
          <div style={{ width: "40vw", float: "left" }}>
            <div className="buttoncontainer" style={{ marginLeft: -47 }}>
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton" onClick={createdeploy}>
                  Deploy
                </Button>
              </div>
              &nbsp;
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton" onClick={destroy}>
                  Delete
                </Button>
              </div>
              &nbsp;
              <div style={{ marginLeft: -47 }}>
                <Button className="kbutton " onClick={logs}>
                  Logs
                </Button>
              </div>
            </div>
            <div className="text-start form_left">
              <div className="row mb-3">
                <div>
                  <Label className="required" editorId="projects_name">
                    Resource Group Name: &nbsp;{" "}
                  </Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Resource Name"
                    value={resource_name}
                    onChange={(event) => {
                      setresource_name(event.target.value);
                    }}
                  />
                </div>{" "}
              </div>{" "}
              <div className="row mb-3">
                <div>
                  <Label className="required">Resource Location: &nbsp; </Label>{" "}
                  <DropDownList
                    className="borderall form_component_width_autodeploy"
                    data={location}
                    value={resource_location}
                    onChange={handleChange}
                  />{" "}
                </div>{" "}
              </div>
              <div className="row mb-3">
                <div>
                  <Label className="required">Kubernetes Name: &nbsp; </Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    placeholder="Enter Kubernetes Name"
                    value={resource_name + "_aks"}
                    disabled={true}
                  />
                </div>{" "}
              </div>{" "}
              <div className="row mb-3">
                <div>
                  <Label className="required">Node Count: &nbsp; </Label>{" "}
                  <Input
                    className="borderall form_component_width_autodeploy"
                    placeholder="Node Counts"
                    value={node_count}
                    onChange={(event) => {
                      setnode_count(event.target.value);
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
      </div>
    </React.Fragment>
  );
};
export default Kubernetes;
