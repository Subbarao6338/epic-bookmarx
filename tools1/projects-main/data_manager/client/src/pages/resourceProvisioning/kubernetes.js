import React, { useState, useEffect } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { useHistory } from "react-router-dom";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "./../../messages/en-US";
import { Label } from "@progress/kendo-react-labels";
import ReactTooltip from "react-tooltip";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  autodeploy_url,
  autodestroy_url,
  logs_url,
  delete_kubernetescluster_url,
  iskubernetesclusterexists_url,
  get_projectresource_url,
  get_projectname_url,
} from "./../../commonUtility/api_urls";
import { httpdelete, httpget } from "./../../commonUtility/common_http";
import Environment from "./environment.json";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";
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
  const AccountInfo = AccountInfoDetails();
  const AccountName = AccountInfo["AccountName"];
  const AccountMail = AccountInfo["AccountMail"];
  let history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };
  const [resource_name, setresource_name] = useState("Graviton_kubernetes");
  const [aksLimit, setAKSLimit] = useState(0);
  const [provisionAKSCount, setProvisionedAKSCount] = useState();
  const [node_count, setnode_count] = useState();
  const [nodeMaxLimit, setNodeMaxLimit] = useState(-1);
  const [status, setstatus] = useState("In-Progress");
  const [environment, setenvironment] = useState("Development");
  const [logdetails, setLogDetails] = useState("");
  const [err_msg, seterr_msg] = useState("");
  const [nodeMsg, setNodeMsg] = useState("");
  const [projectList, setprojectList] = useState([
    { text: "Select Project", id: 0 },
  ]);
  const [selectedProject, setSlectedProject] = useState({
    value: { text: "Select Project", id: 0 },
  });
  const [aks_nodes_vm_type, setaks_nodes_vm_type] = useState([]);
  const [selectedaks_nodes_vm_type, setselectedaks_nodes_vm_type] =
    useState("Select VM Type");
  const [resource_location, setresource_location] = useState([]);
  const [selectedresource_location, setselectedresource_location] =
    useState("Select Location");
  const createdeploy = () => {
    setLogDetails("");
    console.log(selectedresource_location, selectedaks_nodes_vm_type);
    if (resource_name === "" && node_count === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (selectedProject.value.id === 0) {
      seterr_msg("Select Project Name.");
    } else if (resource_name === "") {
      seterr_msg("Enter Valid Resource Name.");
    } else if (node_count === "") {
      seterr_msg("Enter Node count");
    } else if (
      selectedresource_location === "" &&
      resource_location.length !== 0
    ) {
      seterr_msg("Select Resource Location.");
    } else if (
      selectedaks_nodes_vm_type === "" &&
      aks_nodes_vm_type.length !== 0
    ) {
      seterr_msg("Select Node VM type.");
    } else {
      const req_value = {
        params: {
          selectedresource_location: selectedresource_location,
          selectedProject: selectedProject.value.id,
          // selectedprojectID:selectedprojectID,
          selectedaks_nodes_vm_type: selectedaks_nodes_vm_type,
          environment: environment,
          resource_name: resource_name,
          node_count: node_count,
          kubernetes_name: resource_name + "_aks",
          page_type: "kubernetes",
          status: status,
        },
      };
      console.log(req_value);
      debugger;
      httpget(iskubernetesclusterexists_url, req_value).then((result) => {
        var resource_count = result[0].count;
        if (parseInt(resource_count) > 0) {
          seterr_msg(
            "Entered Resource Name Already Exists. Please Enter Unique Resource Name."
          );
        } else {
          console.log(req_value);
          httpget(autodeploy_url, req_value).then((result) => {});
        }
      });
    }
  };
  useEffect(() => {
    const req_value = {
      params: { AccountMail: AccountMail, AccountName: AccountName },
    };
    httpget(get_projectname_url, req_value).then((results) => {
      var project_list = results.map(function (elem) {
        return { text: elem.projectname, id: elem.projid };
      });
      setprojectList(project_list);
      console.log(project_list);
    });
  }, []);
  const onenvChange = (e) => {
    setenvironment(e.target.value);
    setDynamicresourcename("", e.target.value);
  };
  const onprojectChange = (event) => {
    setSlectedProject({ value: event.target.value });
    setDynamicresourcename(event.target.value.text, "");
    console.log(event.target.value.id);
    const req_value = {
      params: {
        projid: event.target.value.id,
      },
    };
    httpget(get_projectresource_url, req_value).then((results) => {
      var vm_type = results.nodetype.data.map(function (elem) {
        return elem.aksnodesallowedvmtype;
      });
      var vm_type_list = vm_type[0]
        .replace("{", "")
        .replace("}", "")
        .split(",");
      setaks_nodes_vm_type(vm_type_list);
      var location = results.nodetype.data.map(function (elem) {
        return elem.aksallowedregions;
      });
      var location_list = location[0]
        .replace("{", "")
        .replace("}", "")
        .replaceAll('"', "")
        .split(",");
      setresource_location(location_list);
      setnode_count(results.nodetype.data[0].aksnodesmaxlimit);
      setNodeMaxLimit(results.nodetype.data[0].aksnodesmaxlimit);
      setAKSLimit(results.nodetype.data[0].aksclusterallocatedcount);
      setProvisionedAKSCount(
        results.nodetype.data[0].aks_cluster_provisioned_count
      );
      // setselectedresource_location(location_list[0]);
    });
  };
  const setDynamicresourcename = (proj_name, env_name) => {
    debugger;
    var random_str = (Math.random() + 1).toString(36).substring(5);
    if (proj_name != "") {
      proj_name = proj_name.replace(" ", "_");
    } else {
      proj_name = selectedProject.value.text.replace(" ", "_");
    }
    if (env_name != "") {
      env_name = env_name.replace(" ", "_");
    } else {
      env_name = environment.replace(" ", "_");
    }
    // setresource_name(
    //   "Graviton_" + proj_name + "_" + env_name + "_" + random_str
    // );
    setresource_name("G_" + proj_name + "_" + env_name.substring(0, 3));
  };
  /////destroy ////
  const destroy = () => {
    setLogDetails("");
    console.log("click");
    const req_value = {
      params: {
        selectedresource_location: selectedresource_location,
        selectedProject: selectedProject.value.id,
        selectedaks_nodes_vm_type: selectedaks_nodes_vm_type,
        environment: environment,
        resource_name: resource_name,
        node_count: node_count,
        kubernetes_name: resource_name + "_aks",
        page_type: "kubernetes",
        status: status,
        //
      },
    };
    console.log(req_value);
    httpget(autodestroy_url, req_value).then((result) => {
      //console.log(result);
      httpdelete(delete_kubernetescluster_url, req_value).then((result) => {});
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
          <br />
          <div>
            <h3 id="heading" align="left">
              {enMessages.cdp_menus.kubernetes}
            </h3>
          </div>
          <hr />
        </div>
        <br />
        {projectList.length === 0 ? (
          <div className="content_center" style={{ height: 400, width: 1200 }}>
            <span style={{ fontSize: 24 }}> No Projects Assigned...</span>
          </div>
        ) : (
          <div style={{ width: "80vw" }}>
            <div style={{ width: "40vw", float: "left" }}>
              <div className="text-start form_left">
                <div className="row mb-3">
                  <div>
                    <Label className="required">Project: &nbsp; </Label>
                    <DropDownList
                      className="borderall form_component_width_autodeploy"
                      data={projectList}
                      value={selectedProject.value}
                      textField="text"
                      dataItemKey="id"
                      onChange={onprojectChange}
                    />
                    {provisionAKSCount === aksLimit ? (
                      <div
                        style={{ color: "red", fontSize: 12, width: "500px" }}
                      >
                        Allowed AKS Cluster limit reached for this project
                        (Please contact Admin)
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required">Environment: &nbsp; </Label>
                    <DropDownList
                      className="borderall form_component_width_autodeploy"
                      data={Environment}
                      value={environment}
                      onChange={onenvChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required" editorId="projects_name">
                      Resource Group Name: &nbsp;
                    </Label>
                    <Input
                      className="borderall form_component_width_autodeploy"
                      placeholder="Enter Resource Name"
                      value={resource_name}
                      onChange={(event) => {
                        setresource_name(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required">Kubernetes Name: &nbsp; </Label>
                    <Input
                      className="borderall form_component_width_autodeploy"
                      placeholder="Enter Kubernetes Name"
                      value={resource_name + "_aks"}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required">Node Count: &nbsp; </Label>
                    <Input
                      className="borderall form_component_width_autodeploy"
                      placeholder="Node Counts"
                      value={node_count}
                      type="Number"
                      min={0}
                      onChange={(event) => {
                        if (parseInt(event.target.value) > nodeMaxLimit) {
                          setNodeMsg("* Don't exceed allowed limit");
                        } else {
                          setnode_count(event.target.value);
                          setNodeMsg("");
                        }
                      }}
                    />
                    <div style={{ color: "red", fontSize: 12 }}>{nodeMsg}</div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required">
                      Resource Location: &nbsp;
                    </Label>
                    <DropDownList
                      className="borderall form_component_width_autodeploy"
                      data={resource_location}
                      value={selectedresource_location}
                      onChange={(event) => {
                        setselectedresource_location(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div>
                    <Label className="required">VM type: &nbsp; </Label>
                    <DropDownList
                      className="borderall form_component_width_autodeploy"
                      data={aks_nodes_vm_type}
                      value={selectedaks_nodes_vm_type}
                      onChange={(event) => {
                        setselectedaks_nodes_vm_type(event.target.value);
                      }}
                    />
                  </div>
                </div>
                {err_msg !== "" ? (
                  <div>
                    <span className="k-icon k-i-warning validationimage"></span>
                    &nbsp; <Label className="validationmsg"> {err_msg} </Label>
                  </div>
                ) : (
                  <div> </div>
                )}
              </div>
              <div className="buttoncontainer" style={{ marginLeft: -47 }}>
                <div style={{ marginLeft: "-100px" }}>
                  <Button
                    type="button"
                    className="kbutton"
                    onClick={createdeploy}
                    disabled={aksLimit === provisionAKSCount}
                  >
                    Deploy
                  </Button>
                </div>
                {/* &nbsp;
                <div style={{ marginLeft: -47 }}>
                  <Button className="kbutton" onClick={destroy}>
                    Delete
                  </Button>
                </div> */}
                &nbsp;
                <div style={{ marginLeft: -47 }}>
                  <Button
                    className="kbutton "
                    onClick={logs}
                    disabled={aksLimit === provisionAKSCount}
                  >
                    Logs
                  </Button>
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
                  <pre>
                    <code>{logdetails}</code>
                  </pre>
                </Label>
              ) : (
                <Label></Label>
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default Kubernetes;
