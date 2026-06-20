/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Input } from '@progress/kendo-react-inputs'
import { Label } from '@progress/kendo-react-labels'
import { Button } from '@progress/kendo-react-buttons'
import { httppost, addnew_notifications } from '../commonUtility/common_http'
import { create_settings_url, tenant_id } from '../commonUtility/api_urls'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { name_title, website } from './../commonUtility/validation_regex'
import Swal from 'sweetalert2'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
  },
  {
    id: 'settingssummary',
    route_url: '/settings_summary',
    text: 'Settings Summary',
  },
  {
    id: 'settingscreate',
    route_url: '/settings_create',
    text: 'Create Settings',
  },
]

function Settings() {
  const AccountInfo = AccountInfoDetails()
  const [err_msg, seterr_msg] = useState('')
  const page_name = enMessages['cdp_notifications']['page_settings']

  const history = useHistory()

  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const [storage_account, setstorage_account] = useState('')
  const [azure_sql_instance, setazure_sql_instance] = useState('')
  const [service_principal, setservice_principal] = useState('')
  const [airflow_url, setairflow_url] = useState('')
  const [prefect_url, setprefect_url] = useState('')
  const [notebook, setnotebook] = useState('')
  const [aion_url, setaion_url] = useState('')
  const [databricks, setdatabricks] = useState('')
  const [powerbi, setpowerbi] = useState('')
  const [druid, setdruid] = useState('')
  const [kibana, setkibana] = useState('')
  const [title, setTitle] = useState('')

  const handleTitlechange = (e) => {
    const entered_title = e.target.value
    console.log(entered_title)
    setTitle(entered_title)
  }

  const handlecancel = () => {
    history.push('/settings_summary')
  }

  const createsettings = () => {
    console.log('click')
    console.log(create_settings_url)
    if (title === '' && storage_account ==='' && azure_sql_instance ==='' && service_principal ==='' && airflow_url ==='' && prefect_url ==='' && notebook ==='' && aion_url ==='' && databricks ==='' && powerbi ==='' && druid ==='' && kibana ==='') {
      seterr_msg(enMessages['cdp_validation_msg']['all_mandatory'])
    } else if(!new RegExp(name_title).test(title)) {
      seterr_msg(enMessages['cdp_validation_msg']['settings_title'])
    } else if(!new RegExp(name_title).test(storage_account)) {
      seterr_msg(enMessages['cdp_validation_msg']['storage_account'])
    } else if(!new RegExp(name_title).test(azure_sql_instance)) {
      seterr_msg(enMessages['cdp_validation_msg']['azure_sql_instance'])
    } else if(!new RegExp(name_title).test(service_principal)) {
      seterr_msg(enMessages['cdp_validation_msg']['service_principal'])
    } else if(!new RegExp(website).test(airflow_url)) {
      seterr_msg(enMessages['cdp_validation_msg']['airflow_url'])
    } else if(!new RegExp(website).test(prefect_url)) {
      seterr_msg(enMessages['cdp_validation_msg']['prefect_url'])
    } else if(!new RegExp(website).test(notebook)) {
      seterr_msg(enMessages['cdp_validation_msg']['notebook'])
    } else if(!new RegExp(website).test(aion_url)) {
      seterr_msg(enMessages['cdp_validation_msg']['aion_url'])
    } else if(!new RegExp(website).test(databricks)) {
      seterr_msg(enMessages['cdp_validation_msg']['databricks'])
    } else if(!new RegExp(website).test(powerbi)) {
      seterr_msg(enMessages['cdp_validation_msg']['powerbi'])
    } else if(!new RegExp(website).test(druid)) {
      seterr_msg(enMessages['cdp_validation_msg']['druid'])
    } else if(!new RegExp(website).test(kibana)) {
      seterr_msg(enMessages['cdp_validation_msg']['kibana'])
    } else {
    const req_value = {
      param: {
        title: title,
        storage_account: storage_account,
        azure_sql_instance: azure_sql_instance,
        service_principal: service_principal,
        airflow_url: airflow_url,
        prefect_url: prefect_url,
        notebook: notebook,
        aion_url: aion_url,
        databricks: databricks,
        powerbi: powerbi,
        druid: druid,
        kibana: kibana,
        tenant_id: tenant_id,
        acc_details: AccountInfo['AccountName'],
      },
    }

    httppost(create_settings_url, req_value).then((result) => {
      if (result.data === 'Success') {
        const alert_type = enMessages['cdp_notifications']['alert_type_none']
        const alert_msg = '"' + title + '" Settings Created Successfully.'
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
          title: 'Settings Created Successfully.',
          showConfirmButton: false,
          timer: 1500
        })
        history.push('/settings_summary')
      } else {
        const alert_type = enMessages['cdp_notifications']['alert_type_error']
        const alert_msg = '"' + title + '" Settings Creation Failed.'
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
          title: 'Settings Creation Failed.',
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
            <h3 id="heading" align="left">
              {enMessages.cdp_menus.settingscreate}
            </h3>
          </div>
          <hr />
          <form>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <div className="parent">
                  <div className="left">
                    <div className="container">
                      <div>
                        <Label className="required">Settings Title</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="text"
                          required
                          value={title}
                          onChangeCapture={handleTitlechange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="container">
                      <label className="note_class">
                        {' '}
                        Title already available in List. Title stored like this
                        'title_yyyyMMdd_hhmm'{' '}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <div className="parent">
                  <div>
                    <div className="container">
                      <Label style={{ marginLeft: -340 }}>
                        <b>Storage: </b>
                      </Label>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Storage Account</Label>{' '}
                      </div>
                      <div>
                        <Input
                          type="text"
                          className="borderall"
                          value={storage_account}
                          onChange={(event) => {
                            setstorage_account(event.target.value)
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Azure SQL instance</Label>{' '}
                      </div>
                      <div>
                        <Input
                          type="text"
                          className="borderall"
                          required
                          value={azure_sql_instance}
                          onChange={(event) => {
                            setazure_sql_instance(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Service Principal</Label>{' '}
                      </div>
                      <div>
                        <Input
                          type="text"
                          className="borderall"
                          required
                          value={service_principal}
                          onChange={(event) => {
                            setservice_principal(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="container">
                      <Label style={{ marginLeft: -305 }}>
                        <b>Visualization: </b>
                      </Label>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">PowerBI URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={powerbi}
                          onChange={(event) => {
                            setpowerbi(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Druid URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={druid}
                          onChange={(event) => {
                            setdruid(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Kibana URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={kibana}
                          onChange={(event) => {
                            setkibana(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <div className="parent">
                  <div className="left">
                    <div className="container">
                      <Label style={{ marginLeft: -230 }}>
                        <b>Workflow Orchestration: </b>
                      </Label>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Airflow URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={airflow_url}
                          onChange={(event) => {
                            setairflow_url(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Prefect URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={prefect_url}
                          onChange={(event) => {
                            setprefect_url(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="container">
                      <Label style={{ marginLeft: -345 }}>
                        <b>AI / ML: </b>
                      </Label>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">AION URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={aion_url}
                          onChange={(event) => {
                            setaion_url(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Databricks URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={databricks}
                          onChange={(event) => {
                            setdatabricks(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <div className="parent">
                  <div className="left">
                    <div className="container">
                      <Label style={{ marginLeft: -320 }}>
                        <b>Notebooks: </b>
                      </Label>
                    </div>
                    <div className="container">
                      <div>
                        <Label className="required">Notebook URL</Label>{' '}
                      </div>
                      <div>
                        <Input
                          className="borderall"
                          type="url"
                          required
                          value={notebook}
                          onChange={(event) => {
                            setnotebook(event.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="right"></div>
                </div>
              </div>
              {
                err_msg !=='' ?
                <div>
                  <span className="k-icon k-i-warning validationimage"> </span> &nbsp;
                  <Label className="validationmsg">{err_msg}</Label>
                </div> : <div></div>
              }
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'auto',
                  width: 'auto',
                }}
              >
                <Button
                  type="submit"
                  id="btn"
                  icon="save"
                  className="k-button k-primary"
                  onClick={createsettings}
                ></Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                  id="btn"
                  icon="close-outline"
                  className="k-button k-primary"
                  onClick={handlecancel}
                ></Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
