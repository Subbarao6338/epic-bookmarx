import { Button } from '@progress/kendo-react-buttons'
// import { DropDownList } from '@progress/kendo-react-dropdowns'
// import { Input } from '@progress/kendo-react-inputs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import EditForm from './Contactedit'
// import 'font-awesome/css/font-awesome.min.css'
import Swal from 'sweetalert2'

function AlertChannel() {
  const [openForm, setOpenForm] = React.useState(false)
  const [editItem, setEditItem] = React.useState()
  const [data, setData] = useState({
    contactpoint: [],
  })

  const [reload, setReload] = React.useState(false)

  const [finaldata, setFinalData] = React.useState([])
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/grafana/alertmanager/alerts/')
      .then((res) => {
        console.log(res)
        console.log(res.data.alertmanager_config.receivers.length)

        var checkpoint_details = {}
        var arr_checkpoint_details = []
        for (
          let i = 0;
          i < res.data.alertmanager_config.receivers.length;
          i++
        ) {
          var temp_val =
            res.data.alertmanager_config.receivers[i]
              .grafana_managed_receiver_configs[0]

          checkpoint_details.name = temp_val.name
          checkpoint_details.uid = temp_val.uid
          checkpoint_details.type = temp_val.type
          checkpoint_details.settings_url = temp_val.settings.url
          checkpoint_details.email_url = temp_val.settings.addresses

          arr_checkpoint_details.push({ ...checkpoint_details })
        }

        setFinalData(arr_checkpoint_details)
        // setData((prevState) => ({
        //   ...prevState,
        //   contactpoint: res.data.alertmanager_config.receivers,
        // }));
      })
      .catch()
  }, [reload])

  // console.log(finaldata)
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.target)
  //   const { data } = await axios.get(
  //     'http://localhost:8000/api/grafana/alertmanager/alerts/',
  //   )
  //   const { type, name, url } = Object.fromEntries(formData)
  //   data.alertmanager_config.receivers.push({
  //     name,
  //     grafana_managed_receiver_configs: [
  //       {
  //         settings: {
  //           url,
  //         },
  //         secureSettings: {},
  //         type,
  //         name,
  //         disableResolveMessage: false,
  //       },
  //     ],
  //   })

  //   const res = await axios.post(
  //     'http://localhost:8000/api/grafana/alertmanager/alerts/',
  //     data,
  //   )
  // }

  // console.log(finaldata)

  // const handleDelete = (item) => {
  //   alert(item.name)
  // }

  const handleUpdate = async (prop) => {
    const { data } = await axios.get(
      'http://localhost:8000/api/grafana/alertmanager/alerts/',
    )
    //const { type, name, url } = Object.fromEntries(formData);

    const filtered_receivers = data.alertmanager_config.receivers.filter(
      ({ name }) => name !== prop.name,
    )

    const name = prop.name
    const url = prop.settings_url
    const type = prop.type
    const addresses = prop.email_url
    data.alertmanager_config.receivers = filtered_receivers
    data.alertmanager_config.receivers.push({
      name,
      grafana_managed_receiver_configs: [
        {
          settings: {
            url,
            addresses,
          },
          secureSettings: {},
          type,
          name,
          disableResolveMessage: false,
        },
      ],
    })

    // const res = await axios.post(
    //   'http://localhost:8000/api/grafana/alertmanager/alerts/',
    //   data,
    // )
    setData(data)
    setOpenForm(false)

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: prop.name + '  Contact Point Updated Successfully.',
      showConfirmButton: false,
      timer: 1500,
    })
    setReload((prevState) => !prevState)
  }

  const handleCancelEdit = () => {
    setOpenForm(false)
  }

  const enterDelete = async (item) => {
    Swal.fire({
      title: 'Do you want to delete this record',
      text: item.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (swalResult) => {
      if (swalResult.isConfirmed) {
        const { data } = await axios.get(
          'http://localhost:8000/api/grafana/alertmanager/alerts/',
        )

        const filtered_receivers = data.alertmanager_config.receivers.filter(
          ({ name }) => name !== item.name,
        )
        data.alertmanager_config.receivers = filtered_receivers

        console.log(data)
        const res = await axios.post(
          'http://localhost:8000/api/grafana/alertmanager/alerts/',
          data,
        )

        setReload((prevState) => !prevState)
        console.log(res)

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: item.name + ' Contact point Deleted Successfully.',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    })
  }

  const enterEdit = (item) => {
    setOpenForm(true)
    setEditItem(item)
  }

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
  const [dataState, setDataState] = React.useState(initialDataState)

  const MyEditCommandCell = (props) => (
    <EditCommandCell
      {...props}
      enterEdit={enterEdit}
      enterDelete={enterDelete}
    />
  )

  return (
    <div>
      <div className="m-2">
        <Link to="/Contactinput/" id="alert">
          <Button type="submit" id="btn">
            Create Contact Point
          </Button>
        </Link>
        <br />
        <br />
      </div>

      <div style={{ maxWidth: 'auto' }}>
        <Grid
          pageable={true}
          sortable={true}
          filterable={false}
          data={process(finaldata, dataState)}
          {...dataState}
          onDataStateChange={(e) => {
            setDataState(e.dataState)
          }}
        >
          <Column field="name" title="Name" width="200px" filterable={false} />
          <Column
            field="uid"
            title="Datasource UID"
            width="130px"
            filterable={false}
          />

          <Column field="type" title="Type" width="80px" filterable={false} />
          <Column
            field="settings_url"
            title="Webhook URL"
            width="auto"
            filterable={false}
          />
          <Column
            field="email_url"
            title="Email"
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
        {openForm && (
          <EditForm
            cancelEdit={handleCancelEdit}
            onSubmit={handleUpdate}
            item={editItem}
          />
        )}
      </div>
    </div>
  )
}

export default AlertChannel
