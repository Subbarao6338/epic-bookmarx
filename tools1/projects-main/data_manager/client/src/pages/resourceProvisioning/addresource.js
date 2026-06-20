import React, { useState } from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { SaveButton, CancelButton } from "./../../components/Buttons/buttons";
import { Label } from "@progress/kendo-react-labels";
import { useHistory, useLocation } from "react-router-dom";
import {
  httppost,
  addnew_notifications,
} from "./../../commonUtility/common_http";
import { create_project_resource_url } from "./../../commonUtility/api_urls";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "./../../messages/en-US";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "./../../authUtility/AccountInfo";
import VMdata from "./VMdata.json";
import { Button } from "@progress/kendo-react-buttons";
import location from "./location.json";
import { MultiSelect } from "@progress/kendo-react-dropdowns";

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
    text: "Resource",
  },
  ,
  {
    id: "addresource",
    route_url: "/addresource",
    text: "Add Resource",
  },
];

function Addresource() {
  const locationval = useLocation();
  const { proj_id } = locationval.state;

  let [node, setNode] = useState(0);
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_projects"];

  const history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push({
      pathname: navdata[itemIndex]["route_url"],
      state: {
        proj_id: proj_id,
      },
    });
  };
  const [disable, setDisable] = React.useState(true);
  let [AKSClusterAllocatedCount, setAKSClusterAllocatedCount] = useState(0);
  let [AKSNodesMaxLimit, setAKSNodesMaxLimit] = useState(0);
  const [AKSNodesAllowedVmType, setAKSNodesAllowedVmType] =
    useState("Select VM Type");
  const [AKSAllowedRegions, setAKSAllowedRegions] =
    React.useState("Select Resource");

  const [resource_location, setresource_location] = useState([]);
  const [err_msg, seterr_msg] = useState("");

  const handleChange = (event) => {
    setAKSNodesAllowedVmType(event.target.value);
  };

  const itemRender = (li, itemProps) => {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          name={itemProps.dataItem}
          checked={itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  const handleResource = (event) => {
    setAKSAllowedRegions(event.target.value);
  };

  const handlecancel = () => {
    history.push("/assignresource");
  };

  function incrementCount() {
    if (AKSClusterAllocatedCount <= 9) {
      AKSClusterAllocatedCount = AKSClusterAllocatedCount + 1;
      setAKSClusterAllocatedCount(AKSClusterAllocatedCount);
    }
  }

  function decrementCount() {
    if (AKSClusterAllocatedCount > 0) {
      AKSClusterAllocatedCount = AKSClusterAllocatedCount - 1;
      setAKSClusterAllocatedCount(AKSClusterAllocatedCount);
    }
  }

  function incrementNode() {
    if (node > 1) {
      setDisable(true);
    }

    if (AKSNodesMaxLimit <= 9) {
      AKSNodesMaxLimit = AKSNodesMaxLimit + 1;
      setAKSNodesMaxLimit(AKSNodesMaxLimit);
    }
  }

  function decrementNode() {
    if (AKSNodesMaxLimit > 0) {
      AKSNodesMaxLimit = AKSNodesMaxLimit - 1;
      setAKSNodesMaxLimit(AKSNodesMaxLimit);
    }
  }

  const createresource = () => {
    console.log("click");
    if (AKSClusterAllocatedCount < 1) {
      seterr_msg("Enter All Mandatory Fields");
    } else if (AKSNodesMaxLimit < 1) {
      seterr_msg("Select Nodes Max Limit");
    } else if (AKSNodesAllowedVmType === "Select VM Type") {
      seterr_msg("Select VM Type ");
    } else if (AKSAllowedRegions === "") {
      seterr_msg("Select Resource");
    } else {
      const req_value = {
        params: {
          AKSClusterAllocatedCount: AKSClusterAllocatedCount,
          AKSNodesMaxLimit: AKSNodesMaxLimit,
          AKSNodesAllowedVmType: AKSNodesAllowedVmType,
          AKSAllowedRegions: AKSAllowedRegions,
          projid: proj_id,
        },
      };
      console.log(req_value);
      httppost(create_project_resource_url, req_value).then((result) => {
        if (result.data === "Success") {
          const alert_type = enMessages["cdp_notifications"]["alert_type_none"];
          const alert_msg =
            '"' + AKSNodesAllowedVmType + '" Resource Created Successfully.';
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
            title: " Resource Created Successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          history.push("/deleteresource");
        } else {
          const alert_type =
            enMessages["cdp_notifications"]["alert_type_error"];
          const alert_msg =
            '"' + AKSNodesAllowedVmType + '"  Resource Creation Failed.';
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
            title: " Resource Creation Failed.",
            showConfirmButton: false,
            timer: 1500,
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
              {enMessages.cdp_menus.addResource}{" "}
            </h3>{" "}
          </div>{" "}
          <hr />
          <div className="text-start form_left">
            <div className="row mb-3">
              <div style={{ display: "flex", float: "inline-end" }}>
                <Label className="required" editorId="resource">
                  Kubernetes cluster: &nbsp;{" "}
                </Label>{" "}
                <div style={{ marginLeft: "150px" }}>
                  <Button
                    className="count_button"
                    disabled={AKSClusterAllocatedCount === 0}
                    onChange={(event) => {
                      setAKSClusterAllocatedCount(event.target.value);
                    }}
                    onClick={decrementCount}
                    icon="minus"
                  ></Button>
                  <Label className="count_box">
                    {AKSClusterAllocatedCount}
                  </Label>
                  <Button
                    className="count_button"
                    onChange={(event) => {
                      setAKSClusterAllocatedCount(event.target.value);
                    }}
                    onClick={incrementCount}
                    icon="plus"
                  ></Button>
                </div>
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div style={{ display: "flex" }}>
                <Label className="required" editorId="resource">
                  Node Max Limit: &nbsp;{" "}
                </Label>{" "}
                <div id="space" style={{ marginLeft: "170px" }}>
                  <Button
                    className="count_button"
                    disabled={
                      AKSClusterAllocatedCount === 0 || AKSNodesMaxLimit === 0
                    }
                    // className="me-2"
                    onChange={(event) => {
                      setAKSNodesMaxLimit(event.target.value);
                    }}
                    onClick={decrementNode}
                    icon="minus"
                  ></Button>
                  <Label className="count_box">{AKSNodesMaxLimit}</Label>
                  <Button
                    className="count_button"
                    disabled={AKSClusterAllocatedCount === 0}
                    // className="me-2"
                    onChange={(event) => {
                      setAKSNodesMaxLimit(event.target.value);
                    }}
                    onClick={incrementNode}
                    icon="plus"
                  ></Button>
                </div>
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="vmsize">
                  VM Type
                </Label>
                <MultiSelect
                  className="borderall form_component_width"
                  data={VMdata}
                  // value={AKSNodesAllowedVmType}
                  itemRender={itemRender}
                  onChange={handleChange}
                />
              </div>
              <br />
            </div>
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="vmsize">
                  Location
                </Label>
                <MultiSelect
                  className="borderall form_component_width"
                  data={location}
                  // value={resource_location}
                  itemRender={itemRender}
                  onChange={handleResource}
                />{" "}
              </div>
              <br />
            </div>{" "}
            {err_msg !== "" ? (
              <div>
                <span className="k-icon k-i-warning validationimage"> </span>
                &nbsp; <Label className="validationmsg"> {err_msg} </Label>
              </div>
            ) : (
              <div> </div>
            )}
            <br />
            <div className="button-container button_right">
              <div>
                <SaveButton handleClick={createresource} /> &ensp;
                <CancelButton handleClick={handlecancel} />
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Addresource;
