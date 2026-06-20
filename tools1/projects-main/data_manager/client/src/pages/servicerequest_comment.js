import React, { useState } from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
// import { Input } from '@progress/kendo-react-inputs'
import { Label } from "@progress/kendo-react-labels";
import { useHistory } from "react-router-dom";
import { httppost, addnew_notifications } from "./../commonUtility/common_http";
import { create_comment_url, tenant_id } from "./../commonUtility/api_urls";
import { loadMessages } from "@progress/kendo-react-intl";
import { enMessages } from "../messages/en-US";
import Swal from "sweetalert2";
import { AccountInfoDetails } from "../authUtility/AccountInfo";
import { SaveButton, CancelButton } from "./../components/Buttons/buttons";
import statustype from "./statustype.json";
import { DropDownList } from "@progress/kendo-react-dropdowns";

loadMessages(enMessages, "en-US");

function ServiceRequestDetailsComments() {
  const AccountInfo = AccountInfoDetails();
  const page_name =
    enMessages["cdp_notifications"]["page_servicerequest_details"];
  const params = new URLSearchParams(window.location.search);

  const sr_id = params.get("sr_id");
  const navitems = [
    {
      id: "home",
      route_url: "/resourceprovisioning",
      text: "Resource Provisioning",
    },
    {
      id: "service request",
      route_url: "/servicerequest",
      text: "Service Request",
    },
    {
      id: "sericerequestdetails",
      route_url: "/servicerequest_details?sr_id=" + sr_id,
      text: "Service Request Details",
    },
    {
      id: "sericerequestdetailscomments",
      route_url: "/servicerequest_comment?sr_id=" + sr_id,
      text: "Add Comment",
    },
  ];
  const history = useHistory();
  const [navdata] = React.useState(navitems);
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id);
    console.log(navdata[itemIndex]["route_url"]);
    history.push(navdata[itemIndex]["route_url"]);
  };

  const [comment, setcomment] = useState("");
  const [status, setstatus] = React.useState("Select Status");
  const [err_msg, seterr_msg] = useState("");
  // const[sr_id,setsr_id] = useState("");
  // const [status, setstatus] = useState("");

  const handleChange = (event) => {
    setstatus(event.target.value);
  };
  console.log(status);

  const handlecancel = () => {
    history.push("/servicerequest_details?sr_id=" + sr_id);
  };

  const CreateServiceRequestComment = () => {
    console.log("click");
    if (comment === "") {
      seterr_msg("Enter All Mandatory Fields.");
    } else if (comment.length < 3) {
      seterr_msg("Please Enter Comment.");
    } else if (status === "Select Status") {
      seterr_msg("Please Select Status.");
    } else {
      const formData = new FormData();
      formData.append("comment", comment);

      const params = new URLSearchParams(window.location.search);
      const sr_id = params.get("sr_id");
      formData.append("sr_id", sr_id);
      formData.append("tenant_id", tenant_id);
      formData.append("status", status);
      formData.append("acc_details", AccountInfo["AccountMail"]);

      httppost(create_comment_url, formData).then((result) => {
        if (result.data === "Success") {
          const alert_type = enMessages["cdp_notifications"]["alert_type_none"];
          const alert_msg = '"' + comment + '" Comment Created Successfully.';
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
            title: " Comment Created Successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
          history.push("/servicerequest_details?sr_id=" + sr_id);
        } else {
          const alert_type =
            enMessages["cdp_notifications"]["alert_type_error"];
          const alert_msg = '"' + comment + '" Comment Creation Failed.';
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
            title: "Comment Creation Failed.",
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
              {enMessages.cdp_menus.ServiceRequestDetailsComments}{" "}
            </h3>{" "}
          </div>{" "}
          <hr />
          <div className="text-start form_left">
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="comment">
                  Comment: &nbsp;
                </Label>{" "}
                <textarea
                  id="title_field"
                  className="borderall form_component_width"
                  onChange={(event) => {
                    setcomment(event.target.value);
                  }}
                  placeholder="Enter Comment"
                />
              </div>{" "}
            </div>
            <div className="row mb-3">
              <div>
                <Label className="required" editorId="status">
                  Status: &nbsp;{" "}
                </Label>{" "}
                <DropDownList
                  className="borderall form_component_width"
                  data={statustype}
                  value={status}
                  id="lst"
                  onChange={handleChange}
                />{" "}
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
            <br />
            <div className="button-container button_right">
              <div>
                <SaveButton handleClick={CreateServiceRequestComment} /> &nbsp;
                &nbsp; <CancelButton handleClick={handlecancel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestDetailsComments;
