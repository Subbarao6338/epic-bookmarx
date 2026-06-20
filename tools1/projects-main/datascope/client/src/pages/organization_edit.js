import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Input, TextArea } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { UpdateButton, CancelButton } from "./../components/Buttons/buttons";

const EditForm = (props) => {
  let errmsg =
    typeof props.item.errmsg === "undefined" ? "" : props.item.errmsg;
  const headerCellChange = (prop) => {
    return <b className="k-text-center">{prop.title}</b>;
  };

  return (
    <Dialog
      title={`Edit Organization :  ${props.item.name}`}
      onClose={props.cancelEdit}
      width={450}
      height={300}
      headerCell={headerCellChange}
    >
      <Form
        onSubmit={props.onSubmit}
        initialValues={props.item}
        render={(formRenderProps) => (
          <FormElement
            style={{
              maxWidth: 550,
            }}
          >
            <fieldset className={"k-form-fieldset"}>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="organization_name">
                    Organization Name:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={"name"}
                  component={Input}
                  required={true}
                  autoComplete="off"
                />
              </div>
              {errmsg !== " " ? (
                <div>
                  <Label className="validationmsg">{errmsg}</Label>
                </div>
              ) : (
                <div></div>
              )}
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="details">
                    Details:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={"details"}
                  component={TextArea}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div className="k-form-buttons">
                <UpdateButton disabled={!formRenderProps.allowSubmit} />
                <CancelButton handleClick={props.cancelEdit} />
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    </Dialog>
  );
};

export default EditForm;
