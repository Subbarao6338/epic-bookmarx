import { useState } from "react";
import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { CancelButton } from "../../components/Buttons/buttons";
import { Button } from "@progress/kendo-react-buttons";
import {
  httppost,
  httpget,
  addnew_notifications,
} from "./../../commonUtility/common_http";
import {
  create_user,
  tenant_id,
  is_user_exist,
} from "./../../commonUtility/api_urls";
import { AccountInfoDetails } from "../../authUtility/AccountInfo";
import { enMessages } from "../../messages/en-US";

const AddNewTeamLead = (props) => {
  const AccountInfo = AccountInfoDetails();
  const page_name = "Create Team Lead";
  const [err, seterr] = useState({ msg: "", color: "" });
  React.useEffect(() => {}, []);

  const handleOnSubmit = (props) => {
    if (props.username <= 3) {
      seterr({ msg: "Enter Valid  Name.", color: "red" });
    } else if (!ValidateEmail(props.emailaddress)) {
      seterr({ msg: "Enter Valid Email", color: "red" });
    } else if (!validateEmpId(props.employeeid)) {
      seterr({ msg: "Enter Valid Emp ID", color: "red" });
    } else {
      const req_value = {
        params: {
          user_name: props.username,
          user_mail: props.emailaddress,
          user_id: "",
          user_type: "create",
        },
      };
      httpget(is_user_exist, req_value).then((result) => {
        console.log(result);
        var user_count = result[0].count;
        if (parseInt(user_count) > 0) {
          seterr({
            msg: "Entered User Name or Email Already Exists. Please Enter Unique User Name.",
            color: "red",
          });
        } else {
          const req_value = {
            params: {
              Name: props.username,
              Email: props.emailaddress,
              Emp_ID: props.employeeid,
              role_id: "3",
              tenant_id: tenant_id,
              AccountRole: AccountInfo["AccountRole"],
              proj_id: "",
            },
          };
          console.log(req_value);
          httppost(create_user, req_value).then((result) => {
            if (result.data === "Success") {
              seterr({ msg: "User Created Successfully.", color: "green" });
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_none"];
              const alert_msg =
                '"' + props.username + '" User Created Successfully.';
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
              handleClose(props.username);
            } else {
              seterr({ msg: "User Creation Failed.", color: "red" });
              const alert_type =
                enMessages["cdp_notifications"]["alert_type_error"];
              const alert_msg =
                '"' + props.username + '" User Creation Failed.';
              addnew_notifications(
                AccountInfo["AccountName"],
                AccountInfo["AccountMail"],
                page_name,
                alert_type,
                alert_msg
              );
            }
          });
        }
      });
    }
  };
  const handleClose = (leadname) => {
    props.onSubmit(leadname);
  };

  function ValidateEmail(email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      if (email.indexOf("@hcl.com", email.length - "@hcl.com".length) !== -1) {
        return true;
      }
    }
    return false;
  }

  function validateEmpId(Emp_ID) {
    if (Emp_ID.length !== 8) {
      return false;
    }
    if (!/^[0-9]+$/.test(Emp_ID)) {
      return false;
    }
    return true;
  }

  return (
    <Dialog
      title={`Add New Team Lead:`}
      onClose={props.onClose}
      width={400}
      height="auto"
      style={{ borderRadius: 100 }}
    >
      <Form
        onSubmit={handleOnSubmit}
        render={(formRenderProps) => (
          <FormElement
            style={{
              maxWidth: 550,
            }}
          >
            <fieldset className={"k-form-fieldset"}>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="projectname">
                    User Name:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={"username"}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  onChange={() => {
                    seterr({ msg: "", color: "" });
                  }}
                />
              </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="projectname">
                    Email Address:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={"emailaddress"}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  onChange={() => {
                    seterr({ msg: "", color: "" });
                  }}
                />
              </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="projectname">
                    Employee ID:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={"employeeid"}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  type="number"
                  onChange={() => {
                    seterr({ msg: "", color: "" });
                  }}
                />
              </div>
            </fieldset>
            {err.msg === "" ? (
              <div></div>
            ) : (
              <div>
                <span
                  className={
                    err.color === "green"
                      ? "k-icon k-i-success validationimagesuccess"
                      : "k-icon k-i-warning validationimage"
                  }
                ></span>
                &nbsp;
                <div
                  style={{
                    display: "inline",
                    fontSize: "10pt",
                    fontStyle: "italic",
                    color: err.color,
                  }}
                >
                  {err.msg}
                </div>
              </div>
            )}
            <div className="k-form-buttons">
              <Button className="k-button k-primary" id="btn" icon="save">
                Create
              </Button>
              <Button
                className="cancelbutton"
                icon="close-outline"
                onClick={props.onClose}
              >
                Close
              </Button>
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default AddNewTeamLead;
