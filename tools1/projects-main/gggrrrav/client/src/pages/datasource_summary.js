import * as React from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { Link } from 'react-router-dom'
import EditForm from './datasource_edit'
import { DropdownFilterCell } from '../components/filter/dropdownFilterCell'
import {
  httpget,
  httpput,
  httpdelete,
  addnew_notifications,
} from '../commonUtility/common_http'
import {
  fetch_datasource_url,
  update_datasource_url,
  delete_datasource_url,
  tenant_id,
} from '../commonUtility/api_urls'
import { Button } from '@progress/kendo-react-buttons'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
import Swal from 'sweetalert2' 
var delayInMilliseconds = 1400;

loadMessages(enMessages, 'en-US')

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
]

const list_status = ['Active', 'Idle']
const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        id="btn"
        icon="edit"
        onClick={() => props.enterEdit(props.dataItem)}
      ></Button>
      &emsp;
      <Button
        id="btn"
        icon="delete"
        onClick={() => props.enterDelete(props.dataItem)}
      ></Button>
    </td>
  )
}

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 5,
  skip: 0,
}

const StatusFilterCell = (props) => (
  <DropdownFilterCell {...props} data={list_status} defaultItem={'All'} />
)

const DataSourceSummary = () => {
  const AccountInfo = AccountInfoDetails()
  const page_name = enMessages['cdp_notifications']['page_datasource']

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

    console.log(fetch_datasource_url)
    httpget(fetch_datasource_url, req_value).then((result) => {
      console.log(result)
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

      console.log(delete_datasource_url)
      httpdelete(delete_datasource_url, req_value).then((result) => {
        if (result.data === 'Success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Data Source Deleted Successfully.',
            showConfirmButton: false,
            timer: 1500
          })
          const alert_type = enMessages['cdp_notifications']['alert_type_none']
          const alert_msg =
            '"' + item.datasource_name + '" Data Source Deleted Successfully.'
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
          const alert_msg =
            '"' + item.datasource_name + '" Data Source Deletion Failed.'
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
            title: 'Data Source Deletion Failed.',
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

        let updated_expiry_date =
          typeof event.expiry_date1 === 'undefined'
            ? event.expiry_date
            : event.expiry_date1
        let connection_details_val = JSON.parse(event.connection_details)
        var connection_details_edit = {}
        if (event.datasource_type === 'Azure SQL') {
          connection_details_edit.target_server =
            typeof event.target_server === 'undefined'
              ? connection_details_val.target_server
              : event.target_server
          connection_details_edit.target_db =
            typeof event.target_db === 'undefined'
              ? connection_details_val.target_db
              : event.target_db
          connection_details_edit.user_name =
            typeof event.user_name === 'undefined'
              ? connection_details_val.user_name
              : event.user_name
          connection_details_edit.password =
            typeof event.password === 'undefined'
              ? connection_details_val.password
              : event.password
        } else if (event.datasource_type === 'Azure Storage') {
          connection_details_edit.connection_string =
            typeof event.connection_string === 'undefined'
              ? connection_details_val.connection_string
              : event.connection_string
          connection_details_edit.container_name =
            typeof event.container_name === 'undefined'
              ? connection_details_val.container_name
              : event.container_name
        }

        const req_value = {
          datasource_name: event.datasource_name,
          datasource_type: event.datasource_type,
          connection_details: JSON.stringify(connection_details_edit),
          active_status: event.active_status,
          expiry_date: updated_expiry_date,
          id: event.id,
          acc_details: AccountInfo['AccountName'],
        }
        console.log(update_datasource_url)
        httpput(update_datasource_url, req_value).then((result) => {
          if (result.data === 'Success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Data Source Updated Successfully.',
              showConfirmButton: false,
              timer: 1500
            })

            const alert_type =
              enMessages['cdp_notifications']['alert_type_none']
            const alert_msg =
              '"' +
              event.datasource_name +
              '" Data Source Updated Successfully.'
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
            const alert_msg =
              '"' + event.datasource_name + '" Data Source Updation Failed.'
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
              title: 'Data Source Updation Failed.',
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
          <div>
            <h3 align="left" id="heading">
              {enMessages.cdp_menus.datasourcesummary}
            </h3>
          </div>
          <hr />
          <div align="left">
            <Link to="/datasource_create">
              {/* <VscAdd /> */}
              {/* {enMessages.cdp_menus.datasourcecreate} */}
              <Button icon="plus-outline" id="btn"></Button>
            </Link>
          </div>
          <br />
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
              style={{ maxWidth: 1060 }}
            >
              <Column
                field="slno"
                title="S.No"
                width="60px"
                filterable={false}
              />
              <Column
                field="datasource_name"
                title="Data Source Name"
                width="175px"
              />
              <Column
                field="datasource_type"
                title="Data Source Type"
                width="175px"
              />
              <Column field="connection_details" title="Connection Details" />
              <Column
                field="active_status"
                title="Active Status"
                width="120px"
                filterCell={StatusFilterCell}
              />
              <Column
                field="formatted_expiry_date"
                title="Expiry Date"
                width="120px"
              />
              <Column
                cell={MyEditCommandCell}
                title="Action"
                width="100px"
                filterable={false}
              />
            </Grid>
          </div>
        </div>
      </div>
      {openForm && (
        <EditForm
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
    </React.Fragment>
  )
}

export default DataSourceSummary
