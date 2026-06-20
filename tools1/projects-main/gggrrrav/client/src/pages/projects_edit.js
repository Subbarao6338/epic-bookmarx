import { useState } from 'react'
import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { Form, Field, FormElement } from '@progress/kendo-react-form'
import { Switch, TextArea, Input } from '@progress/kendo-react-inputs'
import { tenant_id, fetch_organization_url } from './../commonUtility/api_urls'
import { httpget } from '../commonUtility/common_http'
import { Label } from '@progress/kendo-react-labels'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { UpdateButton, CancelButton } from './../components/Buttons/buttons'

const EditForm = (props) => {
  let status_of_active = props.item.status
  let org_name = props.item.name
  let errmsg = typeof props.item.errmsg === 'undefined' ? '' : props.item.errmsg

  const [status, setstatus] = React.useState(true)
  const [statusVal, setStatusVal] = React.useState(status_of_active)
  const [orgname, setorgname] = useState([])
  const [value, setValue] = React.useState(org_name)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleToggleSwitch = () => {
    setstatus(!status)
    if (statusVal === 'Active') {
      setStatusVal('InActive')
    } else {
      setStatusVal('Active')
    }
  }

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    }

    if (statusVal === 'Active') {
      setstatus(true)
    } else {
      setstatus(false)
    }

    // console.log(fetch_organization_url)
    httpget(fetch_organization_url, req_value).then((result) => {
      var arr = []
      for (var i = 0; i < result.length; i++) {
        arr.push(result[i].name)
      }
      setorgname(arr)
    })
    // eslint-disable-next-line
  }, [])

  return (
    <Dialog
      title={`Edit Projects: ${props.item.projectname}`}
      onClose={props.cancelEdit}
      width={450}
      height={520}
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
                <div>
                  <Label className="required" editorId="projectname">
                    Project Name:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'projectname'}
                  component={Input}
                  required={true}
                  autoComplete="off"
                />
              </div>
              {errmsg !== ' ' ? (
                <div>
                  <Label className="validationmsg">{errmsg}</Label>
                </div>
              ) : (
                <div></div>
              )}
            </fieldset>
            <fieldset className={'k-form-fieldset'}>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="Details">
                    Details:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'details'}
                  component={TextArea}
                  label={'Details'}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <div>
                  <Label className="required" editorId="resourcegroup">
                    Resource Group:&nbsp;
                  </Label>
                </div>
                <Field
                  className="borderall"
                  name={'resourcegroup'}
                  component={TextArea}
                  label={'Resource Group'}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <fieldset className={'k-form-fieldset'}>
                <div className="mb-3">
                  <div>
                    <Label className="required" editorId="Status">
                      Status:&nbsp;
                    </Label>
                  </div>
                   <Field
                    className="borderall switch_width_popup"
                    name={"status"}
                    component={Switch}
                    onLabel={"Active"}
                    offLabel={"InActive"}
                    //label={'Status'}
                    checked={status}
                    onChange={handleToggleSwitch}
                  />
                </div>
              </fieldset>
              <fieldset className={'k-form-fieldset'}>
                <div className="mb-3">
                  <div>
                    <Label className="required" editorId="Org.Name">
                      Org.Name:&nbsp;
                    </Label>
                  </div>
                  <DropDownList
                    className="borderall"
                    // component={DropDownList}
                    data={orgname}
                    name={'orgname'}
                    value={value}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </fieldset>
            </fieldset>
            <div className="k-form-buttons">
              <UpdateButton disabled={!formRenderProps.allowSubmit} />
              <CancelButton handleClick={props.cancelEdit} />
            </div>
          </FormElement>
        )}
      />
    </Dialog>
  )
}

export default EditForm
