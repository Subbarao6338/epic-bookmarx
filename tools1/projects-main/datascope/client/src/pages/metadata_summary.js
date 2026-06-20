import React, { useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  get_metadata_url,
  delete_metadata_url,
  tenant_id,
} from '../commonUtility/api_urls'
import {
  httpget,
  httpdelete,
  addnew_notifications,
} from '../commonUtility/common_http'
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
  },
  {
    id: 'metadatasummary',
    route_url: '/metadata_summary',
    text: 'Metadata Summary',
  },
]

const initialDataState = {
  sort: [{ field: 'code', dir: 'asc' }],
  take: 10,
  skip: 0,
}

const ViewDeleteCommandCell = (props) => {
  const field = props.field || ''
  const value = props.dataItem[field]
  const id = props.dataItem.id
  return (
    <td>
      <span>
        <Link to={'/metadata_fileview?filename=' + value + '&id=' + id}>
          <Button id="btn" icon="document-manager"></Button>
        </Link>
      </span>
      &nbsp;&nbsp;
      <Button
        id="btn"
        icon="delete"
        onClick={() => props.enterDelete(props.dataItem)}
      ></Button>
    </td>
  )
}

const MetadataSummary = () => {
  const AccountInfo = AccountInfoDetails()
  const page_name = enMessages['cdp_notifications']['page_metadata']

  let history = useHistory()
  const [navdata] = React.useState(navitems)
  const handleItemSelect = (event) => {
    const itemIndex = navdata.findIndex((curValue) => curValue.id === event.id)
    console.log(navdata[itemIndex]['route_url'])
    history.push(navdata[itemIndex]['route_url'])
  }

  const [data, setData] = useState([])

  useEffect(() => {
    const req_value = {
      params: { tenant_id: tenant_id },
    }
    httpget(get_metadata_url, req_value).then((response) => {
      setData(response)
    })
  }, [])

  
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

      console.log(delete_metadata_url)
      httpdelete(delete_metadata_url, req_value).then((result) => {
        if (result.data === 'Success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Metadata Deleted Successfully.',
            showConfirmButton: false,
            timer: 1500
          })
          const alert_type = enMessages['cdp_notifications']['alert_type_none']
          const alert_msg =
            '"' + item.title + '" Metadata Deleted Successfully.'
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
          const alert_msg = '"' + item.title + '" Metadata Deletion Failed.'
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
            title: 'Metadata Deleted Failed.',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
    })
  }
  
  const [dataState, setDataState] = useState(initialDataState)
  const MyViewDeleteCommandCell = (props) => (
    <ViewDeleteCommandCell {...props} enterDelete={enterDelete} />
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
              {enMessages.cdp_menus.metadatasummary}
            </h3>
          </div>
          <hr />
          <div align="left">
            <Link to="/metadata_create">
              {/* <VscAdd 
              {enMessages.cdp_menus.metadatacreate} */}
              <Button icon="plus-outline" id="btn"></Button>
            </Link>
          </div>
          <br />

          <div>
            <Grid
              //className="tableborder"
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
                //className="tableborder"
                field="slno"
                title="S No."
                width="60px"
                filterable={false}
              />
              <Column field="title" title="Title" />
              <Column
                //className="tableborder"
                field="filename"
                title="File Name"
              />
              <Column
                //className="tableborder"
                field="created_on"
                title="Created On"
                width="300px"
              />
              <Column
                //className="tableborder"
                field="filename"
                title="Preview"
                cell={MyViewDeleteCommandCell}
                width="200px"
                filterable={false}
              />
            </Grid>
          </div>
        </div>
      </div>
       <style>
        {`.k-animation-container {
              z-index: 10003;
          }`}
      </style>
    </React.Fragment>
  )
}

export default MetadataSummary
