import React, { useState } from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
//import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { useHistory } from "react-router-dom";
import {
  httppost,
  addnew_notifications,
  httpget,
} from "./../commonUtility/common_http";
import {
  create_organization_url,
  is_organization_exist,
} from "./../commonUtility/api_urls";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { SaveButton, CancelButton } from "./../components/Buttons/buttons";
loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/home",
    text: "Home",
  },
  {
    id: "organizationsummary",
    route_url: "/organization_summary",
    text: "Organization Summary",
  },
  {
    id: "organizationcreate",
    route_url: "/organization_create",
    text: "Create Organization",
  },
];

function Organization() {
  const AccountInfo = AccountInfoDetails();
  const [err_msg, seterr_msg] = useState("");
  const page_name = enMessages["cdp_notifications"]["page_organization"];

  const history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [organization_name, setorganization_name] = useState("");
  const [details, setDetails] = useState("");

  const handlecancel = () => {
    history.push("/organization_summary");
  };

  const createorganization = () => {
    console.log("click");
    if (organization_name === "" && details === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (organization_name.length < 3) {
      seterr_msg("Enter Valid Organization Name");
    } else if (details.length < 3) {
      seterr_msg("Enter Valid Organization Details");
    } else {
      const req_value = {
        params: { name: organization_name, id: "", page_type: "create" },
      };

      httpget(is_organization_exist, req_value).then((result) => {
        var org_count = result[0].count;
        if (parseInt(org_count) > 0) {
          seterr_msg(
            "Entered Organization Name Already Exists. Please Enter Unique Organization Name."
          );
        } else {
          const req_value = {
            params: {
              organization_name: organization_name,
              details: details,
              acc_details: AccountInfo["AccountMail"],
            },
          };
          console.log(create_organization_url);
          httppost(create_organization_url, req_value).then((result) => {
            if (result.data === "Success") {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_none"];
              const alert_msg =
                '"' +
                organization_name +
                '" Organization Created Successfully.';
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
                title: "Organization Created Successfully.",
                showConfirmButton: false,
                timer: 1500,
              });
              history.push("/organization_summary");
            } else {
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_error"];
              const alert_msg =
                '"' + organization_name + '" Organization Creation Failed.';
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
                title: "Organization Creation Failed.",
                showConfirmButton: false,
                timer: 1500,
              });
            }
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
              {enMessages.cdp_menus.organizationcreate}{" "}
            </h3>{" "}
          </div>{" "}
          <hr />
          <div className="text-start form_left">
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="organization_name">
                  Organization Name: &nbsp;{" "}
                </Label>{" "}
                <Input
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setorganization_name(event.target.value);
                  }}
                  placeholder="Enter Organization Name"
                />
              </div>{" "}
            </div>{" "}
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="details">
                  Details: &nbsp;{" "}
                </Label>{" "}
                <textarea
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setDetails(event.target.value);
                  }}
                  placeholder="Enter Details"
                />
              </div>{" "}
            </div>{" "}
            <br />{" "}
            {err_msg !== "" ? (
              <div>
                <span className="k-icon k-i-warning validationimage"> </span>{" "}
                &nbsp; <Label className="validationmsg"> {err_msg} </Label>{" "}
              </div>
            ) : (
              <div> </div>
            )}
            <div className="textstart ms-2 button_right">
              <div>
                <SaveButton handleClick={createorganization} /> &nbsp; &nbsp;
                &nbsp; <CancelButton handleClick={handlecancel} />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Organization;
