import { useState } from "react";
import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Switch, TextArea, Input } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { CancelButton } from "../../components/Buttons/buttons";
import { Button } from "@progress/kendo-react-buttons";

const AddNewTeamLead = (props) => {
  React.useEffect(() => {}, []);

  return (
    <Dialog
      title={`Add New Team Lead:`}
      onClose={props.cancelEdit}
      width={320}
      height={350}
    >
      <Form
        onSubmit={props.onSubmit}
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
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <Button className="k-button k-primary" id="btn" icon="save">
                save
              </Button>
              <CancelButton handleClick={props.cancelEdit} />
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default AddNewTeamLead;
