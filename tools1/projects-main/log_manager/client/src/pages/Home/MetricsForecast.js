// import { Menu } from '@mui/icons-material'
// import { Icon, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

function MetricsForecast() {
  const [data, setData] = useState([])
  const [timeframeH, setTimeframeH] = useState(1)

  const columns = [
    {
      name: 'Timestamp',
      selector: (row) => row._time,
      sortable: true,
    },
    {
      name: 'Pipeline',
      selector: (row) => row.dag_id,
      sortable: true,
    },
    {
      name: 'Failure Count',
      selector: (row) => row._value,
      sortable: true,
    },
  ]

  const handleTimeframeChange = (e) => setTimeframeH(e.target.value)

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/influxdb/metric_forecast/?timeframe_h=${timeframeH}`,
      )
      .then((res) => {
        console.log(res.data)
        const { index, forecast } = res.data.Results
        const data = []

        for (let i = 0; i < index.length - 1; i += 2) {
          data.push({
            _time: new Date(index[i + 1]._time).toUTCString(),
            dag_id: index[i + 1].dag_id,
            _value: Math.round(forecast[i + 1] - forecast[i]),
          })
        }

        // [].map((value, i) => ({
        //   ...value,
        //   _time: new Date(value._time).toUTCString(),
        //   _value: data.forecast[i],
        // }));

        setData(data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [timeframeH])

  return (
    <div>
      <div className="d-flex align-items-center">
        <span>
          <label> Metric name: </label>
          <b> af_agg_dagrun_duration_failed_count</b>
        </span>
        <span className="ms-auto">
          <label className="me-2">Timeframe</label>
          <select style={{ width: 120 }} onChange={handleTimeframeChange}>
            {[1, 2, 3, 4, 5].map((value) => (
              <option value={value}>{'Next ' + value + 'H'}</option>
            ))}
          </select>
        </span>
      </div>
      <div className="mt-2 border rounded">
        <DataTable columns={columns} data={data} pagination dense />
      </div>
    </div>
  )
}

export default MetricsForecast
