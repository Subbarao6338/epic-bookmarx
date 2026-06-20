import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Switch, Input } from '@progress/kendo-react-inputs'
import { Label } from '@progress/kendo-react-labels'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import datasourcetypes from './datasourcetype.json'
import { DatePicker } from '@progress/kendo-react-dateinputs'
import { Button } from '@progress/kendo-react-buttons'

const today = new Date()
const EditForm = (props) => {
  let date_convert = new Date(props.item.expiry_date)
  //let status_of_active = (props.item.status === 1) ? true : false;
  console.log('check', JSON.parse(props.item.connection_details).target_server)

  let status_of_active = props.item.status
  const [active_status, setactive_status] = React.useState(status_of_active)
  const [expiry_date, setexpiry_date] = React.useState(date_convert)

  const [sqlValue, setSqlValue] = React.useState(
    props.item.datasource_type === 'Azure SQL',
  )
  const [storageValue, setStorageValue] = React.useState(
    props.item.datasource_type === 'Azure Storage',
  )

  let connection_details_val = JSON.parse(props.item.connection_details)
  let target_server_val = connection_details_val.target_server
  let target_db_val = connection_details_val.target_db
  let user_name_val = connection_details_val.user_name
  let password_val = connection_details_val.password
  let connection_string_val = connection_details_val.connection_string
  let container_name_val = connection_details_val.container_name

  const handleToggleSwitch = () => {
    setactive_status(!active_status)
  }

  const handleChange = (event) => {
    setSqlValue(event.target.value === 'Azure SQL')
    setStorageValue(event.target.value === 'Azure Storage')
  }

  return (
    <Dialog
      title={`Edit Data Source: ${props.item.datasource_name}`}
      onClose={props.cancelEdit}
      width={450}
      height={480}
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
              <div className="mb-3">
                <Field
                  className="borderall"
                  name={'datasource_name'}
                  component={Input}
                  label={'Data Source Name'}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div className="emptyline"></div>
              <div className="mb-3">
                <Field
                  className="borderall"
                  component={DropDownList}
                  data={datasourcetypes}
                  name={'datasource_type'}
                  label={'Data Source Type'}
                  onChange={handleChange}
                />
              </div>
              <div className="emptyline"></div>
              {sqlValue ? (
                <div>
                  <div className="container">
                    <div>
                      <Field
                        className="borderall"
                        name={'target_server'}
                        component={Input}
                        label={'Target Server'}
                        defaultValue={target_server_val}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                    &emsp;
                    <div>
                      <Field
                        className="borderall"
                        name={'target_db'}
                        component={Input}
                        label={'Target DB'}
                        defaultValue={target_db_val}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="container">
                    <div>
                      <Field
                        className="borderall"
                        name={'user_name'}
                        component={Input}
                        label={'User Name'}
                        defaultValue={user_name_val}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                    &emsp;
                    <div>
                      <Field
                        className="borderall"
                        name={'password'}
                        component={Input}
                        type="password"
                        label={'Password'}
                        defaultValue={password_val}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {storageValue ? (
                <div className="container">
                  <div>
                    <Field
                      className="borderall"
                      name={'connection_string'}
                      component={Input}
                      label={'Connection String'}
                      defaultValue={connection_string_val}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Field
                      className="borderall"
                      name={'container_name'}
                      component={Input}
                      label={'Container Name'}
                      defaultValue={container_name_val}
                      required={true}
                      autoComplete="off"
                    />
                  </div>
                </div>
              ) : null}
              <div className="emptyline"></div>
              <div className="mb-3">
                <div>
                  <Label editorId="Active Status">Active Status:&nbsp;</Label>
                </div>
                <Field
                  className="borderall"
                  name={'active_status'}
                  component={Switch}
                  label={'Active Status'}
                  defaultChecked={active_status}
                  onClick={handleToggleSwitch}
                />
              </div>
              <div className="emptyline"></div>
              <div className="mb-3">
                <Field
                  className="borderall"
                  component={DatePicker}
                  label={'Expiry Date'}
                  name="expiry_date1"
                  min={today}
                  defaultValue={expiry_date}
                  format={'dd/MM/yyyy'}
                  onChange={(event) => {
                    setexpiry_date(event.target.value)
                  }}
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <Button
                type={'submit'}
                className="k-button k-primary"
                icon="save"
                id="btn"
                disabled={!formRenderProps.allowSubmit}
              ></Button>
              <Button
                type={'submit'}
                className="k-button"
                onClick={props.cancelEdit}
                icon="close-outline"
                id="btn"
              ></Button>
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  )
}

export default EditForm
