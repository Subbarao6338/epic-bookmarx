import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { csv2json } from '../../utility/dataParser'

function Fluentd({}) {
  const [fileroptions, setFilterOptions] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState({})
  const loadfilterOptions = () => {
    setFilterOptions([])
  }

  const loadLogs = () => {
    setLoading({ ...loading, querLog: true })
    axios
      .get('http://localhost:8000/api/influxdb/fluentd_logs/')
      .then((res) => {
        const data = csv2json(res.data, {
          skipTop: 3,
          header: true,
          // skipEmptyLines: true,
        })
        setLogs(data)
        console.log(data)
        // setData((prevState) => ({ ...prevState, metrics: data }))
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading({ ...loading, querLog: false }))
  }

  const getLastSyncTime = () => {
    //
  }

  useEffect(() => {
    loadfilterOptions()
    getLastSyncTime()
    loadLogs()
  }, [])

  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )

  return (
    <div className="mt-2 border rounded" style={{ minHeight: 80 }}>
      <DataTable
        columns={defaultColumns}
        data={logs}
        defaultSortAsc={false}
        defaultSortFieldId={1}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        pagination
        paginationComponentOptions={{ selectAllRowsItem: true }}
        dense
      />
    </div>
  )
}

export default Fluentd

const defaultColumns = [
  {
    name: 'Log Time (UTC)',
    selector: (row) => row._time,
    sortable: true,
    // width: '220px',
  },
  {
    name: 'Source',
    selector: (row) => row._measurement,
    sortable: true,
    // width: '240px',
  },
  // {
  //   name: 'Start Time',
  //   selector: (row) => row._start,
  //   sortable: true,
  //   // width: '210px',
  // },
  // {
  //   name: 'Stop Time',
  //   selector: (row) => row._stop,
  //   sortable: true,
  //   // width: '210px',
  // },

  {
    name: 'Error',
    selector: (row) => row._field,
    sortable: true,
    // width: '270px',
  },
  {
    name: 'PipelineName',
    selector: (row) => row.PipelineName,
    sortable: true,
    // width: '270px',
  },
  {
    name: 'Type',
    selector: (row) => row.Type,
    sortable: true,
    // width: '270px',
  },
  // {
  //   name: 'Job',
  //   selector: (row) => row.job,
  //   sortable: true,
  //   width: '200px',
  // },
  // {
  //   name: 'Instance',
  //   selector: (row) => row.instance,
  //   sortable: true,
  //   width: '150px',
  // },
  // {
  //   name: 'Host',
  //   selector: (row) => row.host,
  //   sortable: true,
  //   width: '140px',
  // },
  // {
  //   name: 'Airflow ID',
  //   selector: (row) => row.airflow_id,
  //   sortable: true,
  //   width: '140px',
  // },
  // {
  //   name: 'DAG ID',
  //   selector: (row) => row.dag_id,
  //   sortable: true,
  //   width: '140px',
  // },
  // {
  //   name: 'Value',
  //   selector: (row) => row._value,
  //   sortable: true,
  //   width: '140px',
  // },
  // {
  //   name: 'PipelineName',
  //   selector: (row) => row.PipelineName,
  //   sortable: true,
  // },
  // {
  //   name: 'PipelineRunId',
  //   selector: (row) => row.PipelineRunId,
  //   sortable: true,
  //   width: '340px',
  // },

  // {
  //   name: ' OperationName',
  //   selector: (row) => row.OperationName,
  //   sortable: true,
  // },

  // {
  //   name: 'FailureType',
  //   selector: (row) => row.FailureType,
  //   sortable: true,
  //   width: '140px',
  // },
  // {
  //   name: 'Error Message',
  //   button: true,
  //   width: '150px',
  //   cell: (row) => (
  //     <span
  //       className="k-icon k-i-warning"
  //       onClick={() => alert(row.ErrorMessage)}
  //     ></span>
  //   ),
  // },
]
