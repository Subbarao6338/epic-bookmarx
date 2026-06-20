import React, { useState } from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { useHistory } from "react-router-dom";
import { httppost, addnew_notifications } from "./../commonUtility/common_http";
import { create_service_url, tenant_id } from "./../commonUtility/api_urls";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { SaveButton, CancelButton } from "./../components/Buttons/buttons";

loadMessages(enMessages, "en-US");

const navitems = [
  {
    id: "home",
    route_url: "/resourceprovisioning",
    text: "Resource Provisioning",
  },
  {
    id: "servicerequest",
    route_url: "/servicerequest",
    text: "Service Request",
  },
  {
    id: "servicerequestcreate",
    route_url: "/servicerequest_create",
    text: " Create Service Request ",
  },
];

function ServiceRequest() {
  const AccountInfo = AccountInfoDetails();
  const page_name = enMessages["cdp_notifications"]["page_servicerequest"];

  const history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [title, settitle] = useState("");
  const [details, setdetails] = useState("");
  const [err_msg, seterr_msg] = useState("");
  const [selectedFile, setSelectedFile] = useState();

  const handleFileUploadChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlecancel = () => {
    history.push("/servicerequest");
  };

  const createservicerequest = () => {
    console.log("click");
    if (title === "" && details === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (title.length < 3) {
      seterr_msg("Please Enter Title .");
    } else if (details.length < 3) {
      seterr_msg(" please Enter Service Request Details");
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", selectedFile);
      formData.append(
        "filestatus",
        typeof selectedFile === "undefined" ? false : true
      );
      formData.append("tenant_id", tenant_id);
      formData.append("description", details);
      formData.append("acc_details", AccountInfo["AccountMail"]);

      console.log(create_service_url);
      httppost(create_service_url, formData).then((result) => {
        if (result.data === "Success") {
          const alert_type = enMessages["cdp_notifications"]["alert_type_none"];
          const alert_msg =
            '"' + title + '" Service Request Created Successfully.';
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
            title: "Service Request Created Successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          history.push("/servicerequest");
        } else {
          const alert_type =
            enMessages["cdp_notifications"]["alert_type_error"];
          const alert_msg = '"' + title + '" Service Request Creation Failed.';
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
            title: "Service Request Creation Failed.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  };

  if (ServiceRequest.data === "Success") {
    alert("data save successfully");
  }

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
              {enMessages.cdp_menus.servicerequestcreate}
            </h3>
          </div>
          <hr />

          <div className="text-start form_left">
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="title">
                  Title :&nbsp;
                </Label>
                <Input
                  id="title_field"
                  className="borderall form_component_width"
                  onChange={(event) => {
                    settitle(event.target.value);
                  }}
                  placeholder="Enter Title"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="details">
                  Details:&nbsp;
                </Label>
                <textarea
                  id="details_field"
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setdetails(event.target.value);
                  }}
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div>
                <Label classname="required" editorId="file_path">
                  Upload File:&nbsp;
                </Label>

                <input
                  id="my_file"
                  className=" form_component_width"
                  name="my_file"
                  type="file"
                  multiple={false}
                  onChange={handleFileUploadChange}
                />
              </div>
            </div>
            {err_msg !== "" ? (
              <div>
                <span className="k-icon k-i-warning validationimage"> </span>{" "}
                &nbsp;
                <Label className="validationmsg">{err_msg}</Label>
              </div>
            ) : (
              <div></div>
            )}
            <br />

            <div className="button-container button_right">
              <div>
                <SaveButton handleClick={createservicerequest} />
                &nbsp; &nbsp;
                <CancelButton handleClick={handlecancel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequest;
