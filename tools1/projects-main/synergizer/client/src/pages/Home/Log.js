import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { csv2json } from '../../utility/dataParser'

function Log({}) {
  const [fileroptions, setFilterOptions] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState({})
  const loadfilterOptions = () => {
    setFilterOptions([])
  }

  const loadLogs = () => {
    setLoading({ ...loading, querLog: true })
    axios
      .get(
        `http://localhost:8000/api/influxdb/query_logs/?filter=Type|ADFActivityRun&filter=Status|Failed&timespan=-24h`,
      )
      .then((res) => {
        const data = csv2json(res.data, { skipTop: 3, header: true })
        console.log(data)
        setLogs(data)
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

export default Log

const defaultColumns = [
  {
    name: 'Time Genrated(UTC)',
    selector: (row) => row._time,
    sortable: true,
    width: '220px',
  },

  {
    name: 'PipelineName',
    selector: (row) => row.PipelineName,
    sortable: true,
  },
  {
    name: 'PipelineRunId',
    selector: (row) => row.PipelineRunId,
    sortable: true,
    width: '340px',
  },

  {
    name: ' OperationName',
    selector: (row) => row.OperationName,
    sortable: true,
  },

  {
    name: 'FailureType',
    selector: (row) => row.FailureType,
    sortable: true,
    width: '140px',
  },
  {
    name: 'ErrorMessage',
    button: true,
    width: '120px',
    cell: (row) => (
      <span
        className="k-icon k-i-warning"
        onClick={() => alert(row.ErrorMessage)}
      ></span>
    ),
  },
]
