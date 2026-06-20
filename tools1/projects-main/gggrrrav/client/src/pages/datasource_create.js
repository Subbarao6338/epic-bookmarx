import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Switch, Input } from '@progress/kendo-react-inputs'
import { Label } from '@progress/kendo-react-labels'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { Button } from '@progress/kendo-react-buttons'
import { DatePicker } from '@progress/kendo-react-dateinputs'
import datasourcetypes from './datasourcetype.json'
import { httppost, addnew_notifications } from './../commonUtility/common_http'
import { create_datasource_url, tenant_id } from './../commonUtility/api_urls'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { name_title } from './../commonUtility/validation_regex'
import Swal from 'sweetalert2'
import { AccountInfoDetails } from '../authUtility/AccountInfo'

loadMessages(enMessages, 'en-US')
const defaultValue = new Date()

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
  },
  {
    id: 'datasourcesummary',
    route_url: '/datasource_summary',
    text: 'Data Source Summary',
  },
  {
    id: 'datasourcecreate',
    route_url: '/datasource_create',
    text: 'Create Data Source',
  },
]

function DataSource() {
  const AccountInfo = AccountInfoDetails()
  const page_name = enMessages['cdp_notifications']['page_datasource']

  const history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const today = new Date()

  const [datasource_name, setdatasource_name] = useState('')
  const [active_status, setactive_status] = useState(false)
  const [expiry_date, setexpiry_date] = useState(today)

  const [value, setValue] = React.useState('Azure SQL')
  const [sqlValue, setSqlValue] = React.useState(value === 'Azure SQL')
  const [storageValue, setStorageValue] = React.useState(value === 'Azure Storage')

  const [target_server, settarget_server] = useState('')
  const [target_db, settarget_db] = useState('')
  const [user_name, setuser_name] = useState('')
  const [password, setpassword] = useState('')
  const [connection_string, setconnection_string] = useState('')
  const [container_name, setcontainer_name] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
    setSqlValue(event.target.value === 'Azure SQL')
    setStorageValue(event.target.value === 'Azure Storage')
  }

  const handlecancel = () => {
    history.push('/datasource_summary')
  }

  const [err_msg, seterr_msg] = useState('')
  const createdatasource = () => {
    console.log('click')
   
    if (
      datasource_name === '' &&
      ((value === 'Azure SQL' &&
        target_server === '' &&
        target_db === '' &&
        user_name === '' &&
        password === '') ||
        (value === 'Azure Storage' &&
          connection_string === '' &&
          container_name === '') )
    ) { 
      seterr_msg(enMessages['cdp_validation_msg']['all_mandatory'])
    } else if (!new RegExp(name_title).test(datasource_name)){
      seterr_msg(enMessages['cdp_validation_msg']['datasource_name'])
    } else if (value === 'Azure SQL' && target_server.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_sql_server'])
    } else if (value === 'Azure SQL' && target_db.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_sql_database'])
    } else if (value === 'Azure SQL' && user_name.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_sql_username'])
    } else if (value === 'Azure SQL' && password.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_sql_password'])
    } else if (value === 'Azure Storage' && connection_string.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_storage_connstring'])
    } else if (value === 'Azure Storage' && container_name.length < 3){
      seterr_msg(enMessages['cdp_validation_msg']['azure_storage_container'])
    } else {
      var connection_details = {}
      if (value === 'Azure SQL') {
        connection_details.target_server = target_server
        connection_details.target_db = target_db
        connection_details.user_name = user_name
        connection_details.password = password
      } else if (value === 'Azure Storage') {
        connection_details.connection_string = connection_string
        connection_details.container_name = container_name
      }

      console.log(connection_details)
      console.log(JSON.stringify(connection_details))
      const req_value = {
        params: {
          datasource_name: datasource_name,
          datasource_type: value,
          connection_details: JSON.stringify(connection_details),
          active_status: active_status,
          expiry_date: expiry_date,
          tenant_id: tenant_id,
          acc_details: AccountInfo['AccountName'],
        },
      }
      console.log(create_datasource_url)
      httppost(create_datasource_url, req_value).then((result) => {
        if (result.data === 'Success') {
          const alert_type = enMessages['cdp_notifications']['alert_type_none']
          const alert_msg =
            '"' + datasource_name + '" Data Source Created Successfully.'

          addnew_notifications(
            AccountInfo['AccountName'],
            AccountInfo['AccountMail'],
            page_name,
            alert_type,
            alert_msg,
          )

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Data Source Created Successfully.',
            showConfirmButton: false,
            timer: 1500
          })

          history.push('/datasource_summary')
        } else {
          const alert_type = enMessages['cdp_notifications']['alert_type_error']
          const alert_msg =
            '"' + datasource_name + '" Data Source Creation Failed.'

          addnew_notifications(
            AccountInfo['AccountName'],
            AccountInfo['AccountMail'],
            page_name,
            alert_type,
            alert_msg,
          )

          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Data Source Creation Failed.',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
  }

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
              {enMessages.cdp_menus.datasourcecreate}
            </h3>
          </div>
          <hr />
          <div
            className="flex justify-content-left text-start"
            style={{ marginLeft: 0 }}
          >
            <div className="row">
              <div className="col-3">
                <Label className="required" editorId="datasource_name">Data Source Name</Label>
              </div>
              <div className="col-4">
                <Input
                  className="borderall"
                  onChange={(event) => {
                    setdatasource_name(event.target.value)
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <Label className="required" editorId="datasource_type">Data Source Type</Label>
              </div>
              <div className="col-4">
                <DropDownList
                  data={datasourcetypes}
                  value={value}
                  id="lst"
                  onChange={handleChange}
                />
              </div>
            </div>
            <br />
          </div>
          {sqlValue ? (
            <div className="flex justify-content-left text-start">
              <div className="row">
                <div className="col-3">
                  <Label className="required">Target Server</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="TargetServer"
                    autoComplete="off"
                    onChange={(event) => {
                      settarget_server(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <Label className="required">Target DB</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="TargetDb"
                    autoComplete="off"
                    onChange={(event) => {
                      settarget_db(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <Label className="required">User Name</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="Username"
                    autoComplete="off"
                    onChange={(event) => {
                      setuser_name(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <Label className="required">Password</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="password"
                    type="password"
                    minLength={6}
                    maxLength={18}
                    autoComplete="off"
                    onChange={(event) => {
                      setpassword(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
            </div>
          ) : null}
          {storageValue ? (
            <div className="flex justify-content-left text-start">
              <div className="row">
                <div className="col-3">
                  <Label className="required">Connection String</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="connection_string"
                    autoComplete="off"
                    onChange={(event) => {
                      setconnection_string(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <Label className="required">Container Name</Label>
                </div>
                <div className="col-4">
                  <Input
                    className="borderall"
                    name="container"
                    autoComplete="off"
                    onChange={(event) => {
                      setcontainer_name(event.target.value)
                    }}
                  />
                </div>
              </div>
              <br />
            </div>
          ) : null}
          <div className="flex justify-content-left text-start">
            <div className="row">
              <div className="col-3">
                <Label className="required" editorId="Active Status">Active Status</Label>
              </div>
              <div className="col-4">
                <Switch
                  className="borderall"
                  onLabel={'ON'}
                  offLabel={'OFF'}
                  onChange={(event) => {
                    setactive_status(event.target.value)
                  }}
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <Label className="required" editorId="expiry_date">Expiry Date</Label>
              </div>
              <div className="col-4">
                <DatePicker
                  className="borderall"
                  defaultValue={defaultValue}
                  min={today}
                  onChange={(event) => {
                    setexpiry_date(event.target.value)
                  }}
                  format={'dd-MM-yyyy'}
                />
              </div>
            </div>
            <br />
            {
                err_msg !=='' ?
                <div>
                  <span className="k-icon k-i-warning validationimage"> </span> &nbsp;
                  <Label className="validationmsg">{err_msg}</Label>
                </div> : <div></div>
            }
            <br></br>
          </div>
          <div className="row flex justify-content-left text-start">
            <div className="col-3 flex justify-content-end text-end">
              <Button
                className="k-button k-primary"
                onClick={createdatasource}
                icon="save"
                id="btn"
              ></Button>
            </div>

            <div className="col-4">
              <Button
                className="k-button k-primary"
                onClick={handlecancel}
                icon="close-outline"
                id="btn"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DataSource
