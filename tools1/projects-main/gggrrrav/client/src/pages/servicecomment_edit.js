import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import {
  Input,
  //  TextArea
} from '@progress/kendo-react-inputs'
// import { Button } from "@progress/kendo-react-buttons";
import { Label } from '@progress/kendo-react-labels'
import { UpdateButton, CancelButton } from './../components/Buttons/buttons'
import statustype from './statustype.json'
import { DropDownList } from '@progress/kendo-react-dropdowns'
const EditForm = (props) => {
  console.log(props.item)
  const [status, setstatus] = React.useState('')

  const handleChange = (event) => {
    setstatus(event.target.value)
  }

  return (
    <Dialog
      title={`Edit Comment: ${props.item.comment}`}
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
              <div className="emptyline"> </div>{' '}
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="comment">
                    Comment: &nbsp;{' '}
                  </Label>{' '}
                </div>{' '}
                <Field
                  className="borderall"
                  name={'comment'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                />
              </div>{' '}
              <div className="emptyline"> </div>{' '}
              <div className="mb-3">
                <div className="mb-3">
                  <Field
                    className="borderall"
                    component={DropDownList}
                    data={statustype}
                    name={'status'}
                    value={status}
                    label={'Status'}
                    onChange={handleChange}
                  />{' '}
                </div>{' '}
              </div>{' '}
              <div className="emptyline"> </div>{' '}
              <div className="k-form-buttons">
                <UpdateButton disabled={!formRenderProps.allowSubmit} />{' '}
                <CancelButton handleClick={props.cancelEdit} />{' '}
              </div>{' '}
            </fieldset>{' '}
          </FormElement>
        )}
      />{' '}
    </Dialog>
  )
}

export default EditForm
