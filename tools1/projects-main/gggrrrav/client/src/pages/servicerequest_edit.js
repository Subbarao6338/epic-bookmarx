import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Input, TextArea } from '@progress/kendo-react-inputs'
// import { Button } from "@progress/kendo-react-buttons";
import { Label } from '@progress/kendo-react-labels'
import { UpdateButton, CancelButton } from './../components/Buttons/buttons'

const EditForm = (props) => {
  console.log(props.item)

  return (
    <Dialog
      title={`Edit Service Request: ${props.item.sr_id}`}
      onClose={props.cancelEdit}
      width={350}
      height={440}
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
            <fieldset className={'k-form-fieldset'}>
              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="title">
                    Title:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'title'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                />
              </div>

              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="description">
                    Description:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'description'}
                  component={TextArea}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div className="emptyline"></div>
              <div className="k-form-buttons">
                <UpdateButton disabled={!formRenderProps.allowSubmit} />
                <CancelButton handleClick={props.cancelEdit} />
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    </Dialog>
  )
}

export default EditForm
