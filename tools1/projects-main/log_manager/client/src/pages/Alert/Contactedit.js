import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Input, TextArea } from '@progress/kendo-react-inputs'
import { Button } from '@progress/kendo-react-buttons'
import { Label } from '@progress/kendo-react-labels'
import { UpdateButton, CancelButton } from '../../components/Buttons/buttons'

const EditForm = (props) => {
  console.log(props.item)

  return (
    <Dialog
      title={`Edit Contact Point: ${props.item.name}`}
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
              maxWidth: 350,
            }}
          >
            <fieldset className={'k-form-fieldset'}>
              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="name">
                    Name:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'name'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  disabled="true"
                  style={{ width: '95%' }}
                />
              </div>

              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="webhookurl">
                    Webhook URL:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'settings_url'}
                  component={TextArea}
                  required={true}
                  autoComplete="off"
                  style={{ width: '95%' }}
                />
              </div>
              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="emailurl">
                    Email:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'email_url'}
                  component={TextArea}
                  required={true}
                  autoComplete="off"
                  style={{ width: '95%' }}
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
