import React from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { Breadcrumb } from '@progress/kendo-react-layout'
import { useHistory, useLocation } from 'react-router-dom'
import { loadMessages } from '@progress/kendo-react-intl'
import { enMessages } from '../../messages/en-US'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import { Button } from '@progress/kendo-react-buttons'
import { process } from '@progress/kendo-data-query'
import { AccountInfoDetails } from '../../authUtility/AccountInfo'
import {
  httpget,
  httpdelete,
  addnew_notifications,
} from './../../commonUtility/common_http'
import {
  delete_user_profile,
  get_user_details,
  tenant_id,
} from './../../commonUtility/api_urls'

loadMessages(enMessages, 'en-US')
var delayInMilliseconds = 1400

const EditCommandCell = (props) => {
  return (
    <td>
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
const DeleteUser = () => {
  const location = useLocation()
  const { proj_id } =
    typeof location.state === 'undefined' ? '' : location.state
  const { proj_name } =
    typeof location.state === 'undefined' ? '' : location.state

  const navitems = [
    {
      id: 'home',
      route_url: '/user_management',
      text: 'User Management',
    },
    {
      id: 'delete_user',
      route_url: '/delete_user',
      text: 'Delete Users',
    },
  ]

  const navitemslead = [
    {
      id: 'home',
      route_url: '/home',
      text: 'Home',
    },
    {
      id: 'project_management',
      route_url: '/project_management',
      text: 'Project Management',
    },
    {
      id: 'projectsubmanagement',
      route_url: '/project_submanagement',
      text: proj_name,
    },
    {
      id: 'user_management',
      route_url: '/user_management',
      text: 'User Management',
    },
    {
      id: 'delete_user',
      route_url: '/delete_user',
      text: 'Delete Users',
    },
  ]

  const AccountInfo = AccountInfoDetails()
  const AccountRole = AccountInfo['AccountRole']
  const page_name = enMessages['cdp_notifications']['page_users']
  let history = useHistory()
  const [navdata] = React.useState(
    AccountRole === 'DP Admin' ? navitems : navitemslead,
  )

  const [dataState, setDataState] = React.useState(initialDataState)

  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push({
      pathname: navdata[itemIndex]['route_url'],
      state: { proj_id: proj_id, proj_name: proj_name },
    })
  }
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    }
    httpget(get_user_details, req_value).then((result) => {
      console.log(result)
      setData(result)
    })
  }, [])

  const enterDelete = (item) => {
    Swal.fire({
      title: enMessages['cdp_swal_msg']['dlt_title'],
      // text: item.user_name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const req_value = {
          params: { user_mail: item.user_mail },
        }

        console.log(delete_user_profile)
        httpdelete(delete_user_profile, req_value).then((result) => {
          // console.log(delete_user_profile);
          if (result.data === 'Success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User Profile Deleted Successfully.',
              showConfirmButton: false,
              timer: 1500,
            })
            const alert_type =
              enMessages['cdp_notifications']['alert_type_none']
            const alert_msg =
              '"' + item.user_name + '" User Profile Deleted Successfully.'
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
              '"' + item.user_name + '" User Profile Deletion Failed.'
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
              title: 'User Profile Deletion Failed.',
              showConfirmButton: false,
              timer: 1500,
            })
          }
        })
      }
    })
  }

  const MyEditCommandCell = (props) => (
    <EditCommandCell {...props} enterDelete={enterDelete} />
  )

  return (
    <React.Fragment>
      <ReactTooltip />
      <Breadcrumb
        className="navigationbtn"
        data={navdata}
        onItemSelect={handleItemSelect}
      />

      <div>
        <div>
          <div>
            <h3 id="heading" align="left">
              Delete Users
            </h3>
          </div>
          <hr />
        </div>
        <br />
        <div style={{ maxWidth: 1200 }}>
          <Grid
            pageable={true}
            sortable={true}
            // filterable={true}
            data={process(data, dataState)}
            {...dataState}
            onDataStateChange={(e) => {
              setDataState(e.dataState)
            }}
          >
            <Column field="slno" title="S.No" width="60px" filterable={false} />
            <Column
              field="user_name"
              title="Name"
              width="200px"
              filterable={false}
            />

            <Column
              field="user_mail"
              title="Email"
              width="300px"
              filterable={false}
            />
            <Column
              field="projectname"
              title="Projects Assigned"
              width="170px"
              filterable={false}
            />
            <Column
              field="created_on"
              title="Start Date"
              width="250px"
              filterable={false}
            />
            <Column
              field="action"
              cell={MyEditCommandCell}
              title="Action"
              width="100px"
              filterable={false}
            />
          </Grid>
        </div>
      </div>
    </React.Fragment>
  )
}
export default DeleteUser
