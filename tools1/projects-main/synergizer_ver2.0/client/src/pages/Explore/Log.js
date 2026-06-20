import React, { useEffect, useState } from 'react'
import { Button } from '@progress/kendo-react-buttons'
import DataTable from 'react-data-table-component'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { csv2json, json2csv } from '../../utility/dataParser'
import { Input } from '@progress/kendo-react-inputs'

function Log({}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [fileroptions, setFilterOptions] = useState([])
  // const [lastSyncTime, setLastSyncTime] = useState()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState({})

  // console.log(searchParams.toString());
  const timespan = searchParams.get('timespan')
  const timestamp = searchParams.get('timestamp')

  const loadfilterOptions = () => {
    setFilterOptions([])
  }

  const loadLogs = () => {
    setLoading({ ...loading, querLog: true })
    axios
      .get(
        `http://localhost:8000/api/influxdb/query_logs/?${searchParams.toString()}`,
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

  const syncADFLogs = () => {
    setLoading({ ...loading, adf_sync: true })
    axios
      .post('http://localhost:8000/api/influxdb/sync_logs/')
      .finally(() => setLoading({ ...loading, adf_sync: false }))
  }

  const handleExport = () => {
    const csvString = json2csv(logs)
    const csvContent = 'data:text/csv;charset=utf-8,' + csvString
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'logs.csv')
    document.body.appendChild(link)
    link.click()
  }

  const parseTime = (times) => {
    if (!times) return times

    const split = times.split('|')
    if (split.length === 2) {
      return split
        .map((value) => new Date(parseInt(value)).toUTCString())
        .join(' : ')
    } else {
      const times_int = parseInt(times)
      if (times_int) {
        return new Date(parseInt(times_int)).toUTCString()
      }
      return times?.replace('-', 'Last ')
    }
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
    <div>
      <h4>Log Explorer</h4>
      <div className="">
        <div className="d-flex align-items-center">
          <span className="me-2">
            <b>Filter</b>
          </span>
          <span className="border rounded-pill px-2">
            <span>Time Range: </span>
            <span>{parseTime(timespan || timestamp) || 'Last 12h'}</span>
          </span>

          <span className="ms-auto">
            <Button
              className="me-2"
              id="btn"
              onClick={loadLogs}
              icon={loading.querLog ? 'loading' : 'arrow-60-right'}
            >
              Run
            </Button>
            <Button
              id="btn"
              icon={loading.adf_sync ? 'loading' : 'reload'}
              onClick={syncADFLogs}
            >
              Sync now
            </Button>
          </span>
        </div>
        <div className="mt-2 p-2 border rounded" style={{ minHeight: 80 }}>
          <Input
            className="mb-2 w-100 border"
            defaultValue={decodeURIComponent(searchParams.toString())}
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder="Query String ..."
            spellCheck={false}
          />
          {/* <Button icon="plus">Add Filter</Button> */}
        </div>
      </div>
      <div className="mt-2">
        <div>
          <span className="me-2">
            <b>Log Results</b>
          </span>

          <Button
            id="btn"
            onClick={handleExport}
            className="float-end"
            icon="download"
          >
            Export CSV
          </Button>
        </div>
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
      </div>
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
    name: 'Type',
    selector: (row) => row.Type,
    sortable: true,
    width: '150px',
  },
  {
    name: 'PipelineName',
    selector: (row) => row.PipelineName,
    sortable: true,
    width: '200px',
  },
  {
    name: 'RunId',
    selector: (row) => row.RunId,
    sortable: true,
    width: '220px',
  },

  {
    name: ' OperationName',
    selector: (row) => row.OperationName,
    sortable: true,
    width: '230px',
  },
  {
    name: 'Status',
    selector: (row) => row.Status,
    sortable: true,
    width: '120px',
  },
  {
    name: 'Level',
    selector: (row) => row.Level,
    sortable: true,
    width: '130px',
  },
  // {
  //   name: "EventMessage",
  //   selector: (row) => row.EventMessage,
  //   sortable: true,
  // },
  {
    name: 'FailureType',
    selector: (row) => row.FailureType,
    sortable: true,
    width: '140px',
  },
]
