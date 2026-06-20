import * as React from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { Link } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import EditTab from './settings_edit'
import {
  httpget,
  httpput,
  httpdelete,
  addnew_notifications,
} from '../commonUtility/common_http'
import {
  fetch_settings_url,
  update_settings_url,
  delete_settings_url,
  tenant_id,
} from '../commonUtility/api_urls'
import { useHistory } from 'react-router-dom'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { Button } from '@progress/kendo-react-buttons'
import Swal from 'sweetalert2'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
var delayInMilliseconds = 1400;
loadMessages(enMessages, 'en-US')

const navitems = [
  {
    id: 'home',
    route_url: '/services',
    text: 'Services',
    // iconClass: 'k-i-home',
  },
  {
    id: 'settingssummary',
    route_url: '/settings_summary',
    text: 'Settings Summary',
  },
]

const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        className="k-button k-primary"
        icon="edit"
        id="btn"
        onClick={() => props.enterEdit(props.dataItem)}
      ></Button>
      &nbsp;&nbsp;
      <Button
        className="k-button k-grid-remove-command"
        icon="delete"
        id="btn"
        onClick={() => props.enterDelete(props.dataItem)}
      ></Button>
    </td>
  )
}

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const SettingsSummary = () => {
  const AccountInfo = AccountInfoDetails()
  const page_name = enMessages['cdp_notifications']['page_settings']

  let history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const [openForm, setOpenForm] = React.useState(false)
  const [editItem, setEditItem] = React.useState({ id: 1 })

  const [data, setData] = React.useState([])
  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    }
    console.log(fetch_settings_url)
    httpget(fetch_settings_url, req_value).then((result) => {
      setData(result)
    })
  }, [])

  const [dataState, setDataState] = React.useState(initialDataState)
  const enterEdit = (item) => {
    setOpenForm(true)
    setEditItem(item)
  }

  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages['cdp_swal_msg']['dlt_title'],
      text:  enMessages['cdp_swal_msg']['dlt_text'],
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: { id: item.id },
        }

        console.log(item.id)
        console.log(delete_settings_url)
        httpdelete(delete_settings_url, req_value).then((result) => {
          if (result.data === 'Success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Settings Deleted Successfully.',
              showConfirmButton: false,
              timer: 1500
            })
            const alert_type = enMessages['cdp_notifications']['alert_type_none']
            const alert_msg =
              '"' + item.title + '" Settings Deleted Successfully.'
            addnew_notifications(
              AccountInfo['AccountName'],
              AccountInfo['AccountMail'],
              page_name,
              alert_type,
              alert_msg,
            )
            setTimeout(function() {
              window.location.reload()
            }, delayInMilliseconds);
          } else {
            const alert_type = enMessages['cdp_notifications']['alert_type_error']
            const alert_msg = '"' + item.title + '" Settings Deletion Failed.'
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
              title: 'Settings Deletion Failed.',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
    })
}

  const handleSubmit = (event) => {
    let newData = data.map((item) => {
      if (event.id === item.id) {
        item = { ...event }
        const req_value = {
          storage_account: event.storage_account,
          azure_sql_instance: event.azure_sql_instance,
          service_principal: event.service_principal,
          airflow_url: event.airflow_url,
          prefect_url: event.prefect_url,
          notebook: event.notebook,
          aion_url: event.aion_url,
          databricks: event.databricks,
          powerbi: event.powerbi,
          druid: event.druid,
          kibana: event.kibana,
          id: event.id,
          acc_details: AccountInfo['AccountName'],
        }
        console.log(update_settings_url)
        httpput(update_settings_url, req_value).then((result) => {
          if (result.data === 'Success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Settings Updated Successfully.',
              showConfirmButton: false,
              timer: 1500
            })
            const alert_type =
              enMessages['cdp_notifications']['alert_type_none']
            const alert_msg =
              '"' + event.title + '" Settings Updated Successfully.'
            addnew_notifications(
              AccountInfo['AccountName'],
              AccountInfo['AccountMail'],
              page_name,
              alert_type,
              alert_msg,
            )
            setTimeout(function() {
              window.location.reload()
            }, delayInMilliseconds);
          } else {
            const alert_type =
              enMessages['cdp_notifications']['alert_type_error']
            const alert_msg = '"' + event.title + '" Settings Updation Failed.'
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
              title: 'Settings Updation Failed.',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
      return item
    })
    setData(newData)
    setOpenForm(false)
  }

  const handleCancelEdit = () => {
    setOpenForm(false)
  }

  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  )

  return (
    <React.Fragment>
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />

      <div>
        <div>
          <h3 id="heading" align="left">
            {enMessages.cdp_menus.settingssummary}
          </h3>
        </div>
        <hr />
        <div className="">
          <Tabs className="tab">
            <TabList className="st" style={{ marginTop: -17 }}>
              <Tab>Storage Details</Tab>
              <Tab>Workflow Orchestrator</Tab>
              <Tab>Notebooks</Tab>
              <Tab>AI/ML</Tab>
              <Tab>Data Visualization</Tab>
            </TabList>
            <div align="left">
              <Link to="/settings_create">
                {/* <VscAdd />
            {enMessages.cdp_menus.settingscreatenew} */}
                <Button icon="plus-outline" id="btn"></Button>
              </Link>
            </div>
            <br />
            {/* TAB for Storage Details Start */}
            <TabPanel>
              <div>
                <div>
                  <div>
                    {/* <p className="tabtitle">
                      <b>Storage Details</b>
                    </p>
                    <br /> */}
                    <Grid
                      pageable={true}
                      sortable={true}
                      filterable={true}
                      data={process(data, dataState)}
                      {...dataState}
                      onDataStateChange={(e) => {
                        setDataState(e.dataState)
                      }}
                    >
                      <Column
                        field="slno"
                        title="S.No"
                        width="60px"
                        filterable={false}
                      />
                      <Column field="title" title="Title" />
                      <Column field="storage_account" title="Storage Account" />
                      <Column
                        field="azure_sql_instance"
                        title="Azure SQL Instance"
                      />
                      <Column
                        field="service_principal"
                        title="Service Principal"
                      />
                      <Column
                        cell={MyEditCommandCell}
                        title="Action"
                        filterable={false}
                      />
                    </Grid>
                  </div>
                </div>
              </div>
              {openForm && (
                <EditTab
                  cancelEdit={handleCancelEdit}
                  onSubmit={handleSubmit}
                  item={editItem}
                />
              )}
              <style>
                {`.k-animation-container {
              z-index: 10003;
          }`}
              </style>
            </TabPanel>
            {/* TAB for Storage Details End */}

            {/* TAB for Workflow Orchestration Start */}
            <TabPanel>
              <div>
                <div>
                  <div>
                    <Grid
                      pageable={true}
                      sortable={true}
                      filterable={true}
                      data={process(data, dataState)}
                      {...dataState}
                      onDataStateChange={(e) => {
                        setDataState(e.dataState)
                      }}
                    >
                      <Column
                        field="slno"
                        title="S.No"
                        width="60px"
                        filterable={false}
                      />
                      <Column field="title" title="Title" />
                      <Column field="airflow_url" title="Airflow URL" />
                      <Column field="prefect_url" title="Prefect URL" />
                    </Grid>
                  </div>
                </div>
              </div>
            </TabPanel>
            {/* TAB for Workflow Orchestration End */}

            {/* TAB for Notebooks Start */}
            <TabPanel>
              <div>
                <div>
                  <div>
                    <Grid
                      pageable={true}
                      sortable={true}
                      filterable={true}
                      data={process(data, dataState)}
                      {...dataState}
                      onDataStateChange={(e) => {
                        setDataState(e.dataState)
                      }}
                    >
                      <Column
                        field="slno"
                        title="S.No"
                        width="60px"
                        filterable={false}
                      />
                      <Column field="title" title="Title" />
                      <Column field="notebook" title="Notebook URL" />
                    </Grid>
                  </div>
                </div>
              </div>
            </TabPanel>
            {/* TAB for Notebooks End */}

            {/* TAB for AI / ML Start */}
            <TabPanel>
              <div>
                <div>
                  <div>
                    <Grid
                      pageable={true}
                      sortable={true}
                      filterable={true}
                      data={process(data, dataState)}
                      {...dataState}
                      onDataStateChange={(e) => {
                        setDataState(e.dataState)
                      }}
                    >
                      <Column
                        field="slno"
                        title="S.No"
                        width="60px"
                        filterable={false}
                      />
                      <Column field="title" title="Title" />
                      <Column field="aion_url" title="AION URL" />
                      <Column field="databricks" title="Databricks URL" />
                    </Grid>
                  </div>
                </div>
              </div>
            </TabPanel>
            {/* TAB for AI / ML End */}

            {/* TAB for Data Visualization Start */}
            <TabPanel>
              <div>
                <div>
                  <div>
                    <Grid
                      pageable={true}
                      sortable={true}
                      filterable={true}
                      data={process(data, dataState)}
                      {...dataState}
                      onDataStateChange={(e) => {
                        setDataState(e.dataState)
                      }}
                    >
                      <Column
                        field="slno"
                        title="S.No"
                        width="60px"
                        filterable={false}
                      />
                      <Column field="title" title="Title" />
                      <Column field="powerbi" title="PowerBI URL" />
                      <Column field="druid" title="Druid URL" />
                      <Column field="kibana" title="Kibana URL" />
                    </Grid>
                  </div>
                </div>
              </div>
            </TabPanel>
            {/* TAB for Data Visualization End */}
          </Tabs>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SettingsSummary
