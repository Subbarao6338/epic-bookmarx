import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Input, TextArea } from '@progress/kendo-react-inputs'
import { Button } from '@progress/kendo-react-buttons'
import { Label } from '@progress/kendo-react-labels'
import { UpdateButton, CancelButton } from '../../components/Buttons/buttons'

const EditForm = (props) => {
  // console.log(props.item);

  return (
    <Dialog
      title={`Edit Alert Rule: ${props.item.Name}`}
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
                  name={'Name'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  style={{ width: '95%' }}
                />
              </div>

              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="name">
                    Folder:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'file'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  disabled={true}
                  style={{ width: '95%' }}
                />
              </div>
              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="name">
                    Group Name:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'name'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                  disabled={true}
                  style={{ width: '95%' }}
                />
              </div>
              <div className="k-form-buttons">
                <UpdateButton disabled={!formRenderProps.allowSubmit} />
                <CancelButton handleClick={props.cancelEdit} />
                {/* <Button themeColor={"primary"} type="submit">
                  Update
                </Button>
                <Button themeColor={"primary"}>Cancel</Button> */}
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    </Dialog>
  )
}

export default EditForm
