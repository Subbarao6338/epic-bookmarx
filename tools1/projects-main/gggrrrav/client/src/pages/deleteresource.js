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
    fetch_project_resource_url,
    update_project_url,
    delete_project_resource_url,
    delete_allproject_resource_url,
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
        id: "home",
        route_url: "/dpadminresource",
        text: "Resource Provisioning",
      },
    {
        id: "resource",
        route_url: "/deleteresource",
        text: "Delete Resource",
    },

];

const list_status = ['Active', 'InActive']
const EditCommandCell = (props) => {
    return (
        <td>
            &nbsp;
            <Button
                className="k-button k-primary"
                id="btn"
                icon="minus"
                onClick={() => props.enterDelete(props.dataItem)
                }
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

const Deleteresource = () => {
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

        console.log(fetch_project_resource_url)
        httpget(fetch_project_resource_url, req_value).then((result) => {
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

    const enterDelete = (item) => {
        Swal.fire({
            title: enMessages['cdp_swal_msg']['dlt_title'],
            text: item.aksnodesallowedvmtype,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const req_value = {
                    params: { id: item.id},
                }

                console.log(delete_project_resource_url)
                httpdelete(delete_project_resource_url, req_value).then((result) => {
                    if (result.data === 'Success') {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Resource Deleted Successfully.',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        const alert_type =
                            enMessages['cdp_notifications']['alert_type_none']
                        const alert_msg =
                            '"' + item.aksnodesallowedvmtype + '" Resource Deleted Successfully.'
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
                            '"' + item.aksnodesallowedvmtype + '" Resource Deletion Failed.'
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
                            title: 'Resource Deletion Failed.',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    }
                })
            }
        })
    }


    const DeleteAll= (item) => {
        // alert("helo");
        Swal.fire({
            title: enMessages['cdp_delete_msg']['dlt_title'],
            text: item.aksnodesallowedvmtype,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
               

                console.log(delete_allproject_resource_url)
                httpdelete(delete_allproject_resource_url).then((result) => {
                    if (result.data === 'Success') {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: ' Resources Deleted Successfully.',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        const alert_type =
                            enMessages['cdp_notifications']['alert_type_none']
                        const alert_msg =
                            '"' + item.aksnodesallowedvmtype + '"Resource Deleted Successfully.'
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
                            '"' + item.aksnodesallowedvmtype + '"Resource Deletion Failed.'
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
                            title: 'Resource Deletion Failed.',
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
                            {enMessages.cdp_menus.deleteResource}
                        </h3>
                    </div>
                    <hr />
                   
                    <div className="text-start">
                        {' '}
                        <Button icon="delete" id="btn" onClick={DeleteAll}>Delete All Resource</Button>
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
                            <Column field="aksnodesallowedvmtype" title="VM Type" width="200px" />

                            <Column
                                field="aksallowedregions"
                                title="Region"
                                width="200px"
                                filterable={false}
                            />
                             <Column
                                field="projid"
                                title="Project ID"
                                width="100px"
                                filterable={false}
                            />
                            <Column
                                field="aksclusterallocatedcount" 
                                title="Kubernetes Cluster"
                                width="200px"
                                filterable={false}
                            />

                            <Column
                                field="aksnodesmaxlimit"
                                title="Node Max Limit"
                                width="200px"
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

export default Deleteresource
