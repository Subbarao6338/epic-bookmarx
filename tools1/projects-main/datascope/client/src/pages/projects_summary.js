import * as React from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { Link } from 'react-router-dom'
import EditForm from './projects_edit'
import { DropdownFilterCell } from '../components/filter/dropdownFilterCell'
import {
  httpget,
  httpput,
  httpdelete,
  addnew_notifications,
} from '../commonUtility/common_http'
import {
  fetch_project_url,
  update_project_url,
  delete_project_url,
  tenant_id,
  is_project_exist,
} from '../commonUtility/api_urls'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from './../messages/en-US'
import { Button } from '@progress/kendo-react-buttons'
import Swal from 'sweetalert2'
import { AccountInfoDetails } from '../authUtility/AccountInfo'
import { CreateButton } from './../components/Buttons/buttons'
loadMessages(enMessages, 'en-US')
var delayInMilliseconds = 1400
const navitems = [
  {
    id: 'home',
    route_url: '/home',
    text: 'Home',
  },
  {
    id: 'projectssummary',
    route_url: '/projects_summary',
    text: 'Projects Summary',
  },
]

const list_status = ['Active', 'InActive']
const EditCommandCell = (props) => {
  return (
    <td>
      <Button
        className="k-button k-primary"
        id="btn"
        icon="edit"
        onClick={() => props.enterEdit(props.dataItem)}
      ></Button>
      &nbsp;
      <Button
        className="k-button k-primary"
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

const ProjectsSummary = () => {
  const AccountInfo = AccountInfoDetails()
  const page_name = enMessages['cdp_notifications']['page_projects']

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

    console.log(fetch_project_url)
    httpget(fetch_project_url, req_value).then((result) => {
      console.log(result)
      setData(result)
    })
  }, [])

  const [dataState, setDataState] = React.useState(initialDataState)

  const enterEdit = (item) => {
    setOpenForm(true)
    console.log(item)
    setEditItem(item)
  }

  const handleSubmit = (event) => {
    const req_value = {
      params: {
        projid: event.projid,
        projectname: event.projectname,
        page_type: 'edit',
      },
    }

    httpget(is_project_exist, req_value).then((result) => {
      var proj_count = result[0].count
      if (parseInt(proj_count) > 0) {
        event.errmsg =
          'Entered Project Name Already Exists. Please Enter Unique Project Name.'
        setOpenForm(true)
        setEditItem(event)
      } else {
        let newData = data.map((item) => {
          if (event.projid === item.projid) {
            item = { ...event }

            const req_value = {
              projid: event.projid,
              projectname: event.projectname,
              details: event.details,
              resourcegroup: event.resourcegroup,
              status: event.status,
              orgid: event.orgid,
              acc_details: AccountInfo['AccountMail'],
            }

            console.log(update_project_url)
            httpput(update_project_url, req_value).then((result) => {
              if (result.data === 'Success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Project Updated Successfully.',
                  showConfirmButton: false,
                  timer: 1500,
                })
                const alert_type =
                  enMessages['cdp_notifications']['alert_type_none']
                const alert_msg =
                  '"' + event.projectname + '" Project Updated Successfully.'
                setTimeout(function () {
                  addnew_notifications(
                    AccountInfo['AccountName'],
                    AccountInfo['AccountMail'],
                    page_name,
                    alert_type,
                    alert_msg,
                  )
                  window.location.reload()
                }, delayInMilliseconds)
              } else {
                const alert_type =
                  enMessages['cdp_notifications']['alert_type_error']
                const alert_msg =
                  '"' + event.projectname + '" Project Updation Failed.'
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
                  title: 'Project Updation Failed.',
                  showConfirmButton: false,
                  timer: 1500,
                })
              }
            })
          }
          return item
        })
        setData(newData)
        setOpenForm(false)
      }
    })
  }

  const handleCancelEdit = () => {
    setOpenForm(false)
  }

  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages['cdp_swal_msg']['dlt_title'],
      text: item.projectname,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: { projectname: item.projectname },
        }

        console.log(delete_project_url)
        httpdelete(delete_project_url, req_value).then((result) => {
          if (result.data === 'Success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Project Deleted Successfully.',
              showConfirmButton: false,
              timer: 1500,
            })
            const alert_type =
              enMessages['cdp_notifications']['alert_type_none']
            const alert_msg =
              '"' + item.projectname + '" Project Deleted Successfully.'
            addnew_notifications(
              AccountInfo['AccountName'],
              AccountInfo['AccountMail'],
              page_name,
              alert_type,
              alert_msg,
            )
            setTimeout(function () {
              window.location.reload()
            }, delayInMilliseconds)
          } else {
            const alert_type =
              enMessages['cdp_notifications']['alert_type_error']
            const alert_msg =
              '"' + item.projectname + '" Project Deletion Failed.'
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
              title: 'Project Deletion Failed.',
              showConfirmButton: false,
              timer: 1500,
            })
          }
        })
      }
    })
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
              {enMessages.cdp_menus.projectssummary}
            </h3>
          </div>
          <hr />
          <div className="text-start">
            {' '}
            <Link to="/projects_create">
              <CreateButton
                buttonlabel={enMessages['cdp_button_labels']['projectscreate']}
              />
            </Link>
          </div>

          <br />
          <div style={{ maxWidth: 1100 }}>
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
              <Column field="projectname" title="Project Name" width="200px" />

              <Column
                field="details"
                title="Details"
                width="200px"
                filterable={false}
              />
              <Column
                field="resourcegroup"
                title="Resource group"
                width="200px"
                filterable={false}
              />
              <Column
                field="status"
                title="Status"
                width="120px"
                filterCell={StatusFilterCell}
              />
              <Column field="name" title="Organization" width="200px" />

              <Column
                field="action"
                cell={MyEditCommandCell}
                title="Action"
                width="100px"
                filterable={false}
              />
            </Grid>

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
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ProjectsSummary
