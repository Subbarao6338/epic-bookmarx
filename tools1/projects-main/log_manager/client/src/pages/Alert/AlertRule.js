import { Button } from '@progress/kendo-react-buttons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import EditForm from './Alertedit'
// import "font-awesome/css/font-awesome.min.css";
import Swal from 'sweetalert2'
function AlertRule() {
  const [openForm, setOpenForm] = React.useState(false)
  const [editItem, setEditItem] = React.useState()
  const [data, setData] = useState({
    alerts: [],
  })
  const [reload, setReload] = React.useState(false)
  const [finaldata, setFinalData] = React.useState([])
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/grafana/alertlist/')
      .then((res) => {
        // console.log(res.data);
        // console.log(res.data.data.groups.length);

        var alert_details = {}
        var arr_alert_details = []

        for (let i = 0; i < res.data.data.groups.length; i++) {
          var temp_val = res.data.data.groups[i]
          for (let j = 0; j < temp_val.rules.length; j++) {
            var temp_rule = temp_val.rules[j]
            alert_details.Name = temp_rule.name
            alert_details.file = temp_val.file
            alert_details.name = temp_val.name
            alert_details.File = temp_val.lastEvaluation

            arr_alert_details.push({ ...alert_details })
          }
        }

        setFinalData(arr_alert_details)
      })
      .catch()
  }, [reload])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   const formData = new FormData(e.target)
  //   const {
  //     name,
  //     folder,
  //     group,
  //     datasource,
  //     query,
  //     threshold,
  //   } = Object.fromEntries(formData)

  //   const { data } = await axios.get(
  //     `http://localhost:8000/api/grafana/rules/${folder}/${group}/`,
  //   )

  //   const newRule = {
  //     grafana_alert: {
  //       title: name,
  //       condition: 'B',
  //       data: [
  //         {
  //           refId: 'A',
  //           datasourceUid: datasource,
  //           queryType: '',
  //           relativeTimeRange: {
  //             from: 600,
  //             to: 0,
  //           },
  //           model: {
  //             refId: 'A',
  //             hide: false,
  //             query,
  //           },
  //         },
  //         {
  //           refId: 'B',
  //           datasourceUid: '-100',
  //           queryType: '',
  //           model: {
  //             refId: 'B',
  //             hide: false,
  //             type: 'classic_conditions',
  //             datasource: {
  //               uid: '-100',
  //               type: '__expr__',
  //             },
  //             conditions: [
  //               {
  //                 type: 'query',
  //                 evaluator: {
  //                   params: [threshold],
  //                   type: 'gt',
  //                 },
  //                 operator: {
  //                   type: 'and',
  //                 },
  //                 query: {
  //                   params: ['A'],
  //                 },
  //                 reducer: {
  //                   params: [],
  //                   type: 'last',
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //     for: '5m',
  //     annotations: {},
  //     labels: {},
  //   }

  //   data.rules.push(newRule)
  //   console.log(data)

  //   const res = await axios.post(
  //     `http://localhost:8000/api/grafana/rules/${folder}/`,
  //     data,
  //   )
  //   console.log(res.data)
  //   window.alert(res.data.message)
  // }

  const handleUpdate = async (item) => {
    console.log(item)

    var { data } = await axios.get(
      `http://localhost:8000/api/grafana/rules/${item.file}/${item.name}/`,
    )
    console.log(data)
    data.rules = data.rules.map((rule) => {
      if (
        (rule.grafana_alert.title === item.Name) |
        (rule.grafana_alert.rule_group === item.name)
      ) {
        rule.grafana_alert.title = item.Name
        rule.grafana_alert.rule_group = item.name

        return rule
      }
    })

    const res = await axios.post(
      `http://localhost:8000/api/grafana/rules/${item.file}/`,
      data,
    )

    setData(data)
    setOpenForm(false)

    console.log(res.data)
    // window.alert(res.data.message)
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: item.Name + ' Alert Rule updated successfully.',
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
      text: item.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (swalResult) => {
      if (swalResult.isConfirmed) {
        const res = await axios.delete(
          `http://localhost:8000/api/grafana/rules/${item.file}/${item.name}/`,
        )

        setReload((prevState) => !prevState)
        console.log(res)

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: item.Name + '  Alert rule  deleted Successfully.',
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
        <Link to="/Alertinput/" id="alert">
          <Button type="submit" id="btn">
            Create Rule
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
          <Column field="Name" title="Name" width="auto" filterable={false} />
          <Column field="file" title="Folder" width="auto" filterable={false} />

          <Column
            field="name"
            title="Group Name"
            width="auto"
            filterable={false}
          />

          <Column
            field="File"
            title="Last Evaluation"
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

export default AlertRule
