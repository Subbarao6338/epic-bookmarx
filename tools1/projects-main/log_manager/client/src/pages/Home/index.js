import { useEffect, useState } from 'react'
import PieChart from './pie_chart'
// import DonutChart from './donut'
import axios from 'axios'
import Papa from 'papaparse'
import alert_logo from '../../assets/alert.png'
import metrics_logo from '../../assets/metrics.png'
import metrics_source_logo from '../../assets/metrics_source.png'
import ViewStateHistory from './history_popup'
import { Button } from '@progress/kendo-react-buttons'
// import Pager from './PagerJS'
// import Log from './Log'
import Fluentd from './fluentd_logs'
import MetricsForecast from './MetricsForecast'
import DataTable from 'datatables.net'
import ADFPipelines from './ADFPipelines'
import { SelectTimeRange, timeOptions } from '../../components/SelectTimeRange'

export default function Home() {
  const [data, setData] = useState({
    dags: [],
    dag_runs: [],
    dag_detail: [],
    metricSources: [],
    metrics: [],
    alerts: [],
    airflow_pipelines_success: { success_pipelines: [], success_count: 0 },
    airflow_pipelines_failure: { failed_pipelines: [], failure_count: 0 },
    adf_pipelines_success: { success_pipelines: [], success_count: 0 },
    adf_pipelines_failure: { failed_pipelines: [], failure_count: 0 },
  })
  const [timespan, setTimespan] = useState(timeOptions[0].value)

  const [openViewStateHistory, setOpenViewStateHistory] = useState({
    show: false,
  })
  const [alertSummary, setAlertSummary] = useState([])

  const handleViewStateHistory = (value) => {
    var filtered_summary = alertSummary.filter(
      (val) => val.rule_name === value.rule_name,
    )

    setOpenViewStateHistory({
      show: true,
      rule_name: value.rule_name,
      state_history: filtered_summary[0].state_history,
    })
  }
  const handleTimeRangeChange = (e) => {
    setTimespan(JSON.parse(e.target.value))
  }

  function convertTime(t) {
    let year, month, day, hour, minute, second

    second = Math.floor(t / 1000)
    minute = Math.floor(second / 60)
    second = second % 60
    hour = Math.floor(minute / 60)
    minute = minute % 60
    day = Math.floor(hour / 24)
    hour = hour % 24
    month = Math.floor(day / 30)
    day = day % 30
    year = Math.floor(month / 12)
    month = month % 12

    let ret = '0 sec ago'
    if (year === 0 && month === 0 && day === 0 && hour === 0 && minute === 0) {
      ret = second + ' sec ago'
    } else if (
      year === 0 &&
      month === 0 &&
      day === 0 &&
      hour === 0 &&
      minute !== 0
    ) {
      ret = minute + ' min ' + second + ' sec ago'
    } else if (year === 0 && month === 0 && day === 0 && hour !== 0) {
      ret = hour + ' hrs ' + minute + ' min ago'
    } else if (year === 0 && month === 0 && day !== 0) {
      ret = day + ' days ' + hour + ' hrs ago'
    } else if (year === 0 && month !== 0) {
      ret = month + ' months ' + day + ' days ago'
    } else if (year !== 0) {
      ret = year + ' years ' + month + ' months ago'
    } else {
      ret = second + ' sec ago'
    }
    return ret
  }

  function myFunction(time) {
    if (time !== '--') {
      var date_now = new Date()
      var given_time = new Date(time)
      var last_updated = date_now.getTime() - given_time.getTime()
      return convertTime(last_updated)
    } else {
      return '--'
    }
  }
  function secondsToHms(d) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)
    var hDisplay = h > 0 ? h + (h === 1 ? ' hour ' : ' hours ') : ''
    var mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' min ') : ''
    var sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay + sDisplay
  }
  function mergePipelines_success() {
    var success_count_airflow = 0
    console.log(data)
    data.airflow_pipelines_success.success_pipelines.map((value) => {
      // console.log(value)
      success_count_airflow = success_count_airflow + value._value_b
    })
    return success_count_airflow
  }
  useEffect(() => {
    axios
      .post('http://localhost:8000/api/influxdb/query/', {
        query: `from(bucket: "my-bucket")
        |> range(start: -24h)
        |> filter(fn: (r) => r["_measurement"] == "prometheus_remote_write")
        |> group(columns: ["job"])
        |> count()`,
      })
      .then((res) => {
        // console.log(res.data);
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        })
        setData((prevState) => ({ ...prevState, metricSources: data }))
      })
      .catch()

    axios
      .post('http://localhost:8000/api/influxdb/query/', {
        query: `from(bucket: "my-bucket")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "prometheus_remote_write")
        |> keep(columns: ["_field","_time","_value","job"])
        |> group(columns: ["_field"])
        |> last()
        |> group()`,
      })
      .then((res) => {
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        })
        // console.log(data);
        setData((prevState) => ({ ...prevState, metrics: data }))
      })
      .catch()
    axios
      .post('http://localhost:8000/api/influxdb/query/', {
        query: `a=from(bucket: "my-bucket")
        |> range(start: -24h, stop: now())
        |> filter(fn: (r) => r["_field"] == "af_agg_dagrun_duration_success")
        |> filter(fn: (r) => r["quantile"] == "0.9")
        |> group(columns: ["dag_id"])
        |> last()
        b=from(bucket: "my-bucket")
        |> range(start: -2d, stop: now())
        |> filter(fn: (r) => r["_field"] == "af_agg_dagrun_duration_success_count")
        |> group(columns: ["dag_id"])
        |> increase()
        |> last()
        join(
        tables: {a, b},
        on: ["dag_id"],
           )`,
      })
      .then((res) => {
        console.log(res.data)
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        })
        console.log(data)
        let s_count = 0
        data.map((value) => {
          s_count = s_count + parseInt(value._value_b)
        })
        setData((prevState) => ({
          ...prevState,
          airflow_pipelines_success: {
            success_pipelines: data,
            success_count: s_count,
          },
        }))
        // console.log(mergePipelines_success())
      })
      .catch()

    axios
      .get('http://localhost:8000/api/grafana/alertlist_home/')
      .then((res) => {
        console.log(res)
        var data = res.data.data
        data = data.sort(
          (b, a) =>
            new Date(a.active_at).getTime() - new Date(b.active_at).getTime(),
        )
        console.log(data)
        setData((prevState) => ({
          ...prevState,
          alerts: data,
        }))
      })
      .catch()

    axios
      .get('http://localhost:8000/api/grafana/alertsummary/')
      .then((res) => {
        // console.log(res);
        setAlertSummary(res.data.summary)
      })
      .catch()

    axios
      .get('http://localhost:8000/api/grafana/getadfpipeline_success/')
      .then((res) => {
        console.log(res)
        setData((prevState) => ({
          ...prevState,
          adf_pipelines_success: {
            success_pipelines: res.data.success_pipelines,
            success_count: res.data.success_count,
          },
        }))
      })
      .catch()

    axios
      .get('http://localhost:8000/api/grafana/getadfpipeline_failure/')
      .then((res) => {
        console.log(res)
        var data = res.data.data
        // data= data.sort((b,a) => new Date(a.failure_count)- new Date(b.failure_count));
        // res.sort((a,b) => a.failure_count - b.failure_count);
        setData((prevState) => ({
          ...prevState,
          adf_pipelines_failure: {
            failed_pipelines: res.data.failed_pipelines,
            failure_count: res.data.failure_count,
          },
        }))
      })
      .catch()

    axios
      .get('http://localhost:8000/api/airflow/dags/')
      .then((res) => {
        console.log(typeof res.data, res.data)
        // debugger;
        console.log(res)
        setData((prevState) => ({
          ...prevState,
          dags: res.data.dags,
        }))
      })
      .catch()

    axios
      .get('http://localhost:8000/api/airflow/dag_runs/')
      .then((res) => {
        console.log(typeof res.data, res.data)
        // debugger;
        console.log(res)
        setData((prevState) => ({
          ...prevState,
          dag_runs: res.data.dag_runs,
        }))
      })
      .catch()

    axios
      .get('http://localhost:8000/api/airflow/dag_detail/')
      .then((res) => {
        console.log(typeof res.data, res.data)
        // debugger;
        console.log(res)
        setData((prevState) => ({
          ...prevState,
          dag_detail: res.data,
        }))
      })
      .catch()
  }, [])

  useEffect(() => {
    console.log(timespan)

    const query = `from(bucket: "my-bucket")
    |> range(start: ${timespan.from}, stop: now())
    |> filter(fn: (r) => r["_field"] == "af_agg_dagrun_duration_failed_count")
    |> group(columns: ["dag_id"])
    |> increase()
    |> last()
    |> group()
    `
    console.log(query)
    axios
      .post('http://localhost:8000/api/influxdb/query/', {
        query: query,
      })
      .then((res) => {
        console.log(res.data)
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        })
        console.log(data)
        let f_count = 0
        data.map((value) => {
          f_count = f_count + parseInt(value._value)
        })
        setData((prevState) => ({
          ...prevState,
          airflow_pipelines_failure: {
            failed_pipelines: data,
            failure_count: f_count,
          },
        }))
      })
      .catch((err) => console.error(err))
      .finally(() => console.log('airflow failed count fetched succeess'))
  }, [timespan])

  useEffect(() => {
    setTimeout(() => {
      let table = new DataTable('#res_table', {
        destroy: true,
        searching: false,
      })
    }, 5000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      let table = new DataTable('#alert_table', {
        destroy: true,
        searching: false,
        ordering: false,
      })
    }, 7000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      let table = new DataTable('#tidxx', {
        destroy: true,
        searching: false,
        order: [[1, 'desc']],
        paging: false,
        info: false,
      })
    }, 10000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      let table = new DataTable('#airflow_table', {
        destroy: true,
        searching: false,
      })
    }, 7000)
  }, [])

  return (
    <>
      <div className="row m-2">
        <div
          className="col mx-2"
          style={{
            background: `linear-gradient(#045DE9, rgb(87, 173, 213))`,
            borderRadius: 6,
          }}
        >
          <div className="row">
            <img src={metrics_source_logo} className="col-3" alt=""></img>
            <div className="col">
              <div
                style={{
                  fontSize: '25px',
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                Metric Sources
              </div>
              <div style={{ fontSize: '15px', color: 'white' }}>
                Total Count
              </div>
            </div>
            <div
              className="col"
              style={{
                fontSize: '45px',
                fontFamily: 'Consolas',
                color: 'white',
                textAlign: 'right',
              }}
            >
              {data.metricSources.length}
            </div>
          </div>
        </div>
        <div
          className="col mx-4"
          style={{
            background: `linear-gradient(#045DE9, rgb(87, 173, 213))`,
            borderRadius: 6,
          }}
        >
          <div className="row">
            <img src={metrics_logo} className="col-3" alt=""></img>
            <div className="col">
              <div className="" style={{ fontSize: '25px', color: 'white' }}>
                Metrics
              </div>
              <div className="" style={{ fontSize: '15px', color: 'white' }}>
                Total Count
              </div>
            </div>
            <div
              className="col"
              style={{
                fontSize: '45px',
                fontFamily: 'Consolas',
                color: 'white',
                textAlign: 'right',
              }}
            >
              {data.metrics.length}
            </div>
          </div>
        </div>
        <div
          className="col mx-2"
          style={{
            background: `linear-gradient(#1B6C09, #B5D4B2)`,
            borderRadius: 6,
          }}
        >
          <div className="row">
            <img src={alert_logo} className="col-3" alt=""></img>
            <div className="col-6">
              <div className="row" style={{ fontSize: '25px', color: 'white' }}>
                Alerts
              </div>
              <div className="row" style={{ fontSize: '15px', color: 'white' }}>
                Total Count
              </div>
            </div>
            <div
              className="col-3"
              style={{
                fontSize: '45px',
                fontFamily: 'Consolas',
                color: 'white',
                textAlign: 'right',
              }}
            >
              {data.alerts.length}
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="row m-2">
        <div className="col-4">
          <h4>Metric Sources</h4>
          <div
            className=" table-responsive border"
            style={{ height: 240, flexShrink: 0 }}
          >
            <table className="table table-hover position-relative">
              <thead
                className="position-sticky top-0"
                style={{ backgroundColor: '#3498DB' }}
              >
                <tr style={{ color: 'white' }}>
                  <th>Metrics Source</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.metricSources.map((value) => (
                  <tr>
                    <td>{value.job}</td>
                    <td>{myFunction(value._stop)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ViewStateHistory
          openViewStateHistory={openViewStateHistory}
          setOpenViewStateHistory={setOpenViewStateHistory}
        />
        <div className="col-4" style={{ width: 'auto' }}>
          <div className="row">
            <div className="col-4" style={{ width: 'auto' }}>
              <h4>Pipeline Failure</h4>
            </div>
            <div className="col-6" style={{ width: 'auto' }}>
              <label className="border border-white position-sticky top-0">
                Time Range
              </label>
              {/* <select class="border rounded p-1"><option id="Last 6 hours" value="{&quot;from&quot;:&quot;2022-08-09T03:43:02.534Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.535Z&quot;}">Last 6 hours</option><option id="Last 24 hours" value="{&quot;from&quot;:&quot;2022-08-08T09:43:02.535Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.535Z&quot;}">Last 24 hours</option><option id="Last week" value="{&quot;from&quot;:&quot;2022-08-02T09:43:02.535Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.535Z&quot;}">Last week</option><option id="Last month" value="{&quot;from&quot;:&quot;2022-07-09T09:43:02.535Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.536Z&quot;}">Last month</option><option id="Last 6 months" value="{&quot;from&quot;:&quot;2022-02-09T09:43:02.536Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.536Z&quot;}">Last 6 months</option><option id="Last year" value="{&quot;from&quot;:&quot;2021-08-09T09:43:02.536Z&quot;,&quot;to&quot;:&quot;2022-08-09T09:43:02.536Z&quot;}">Last year</option></select> */}
              <SelectTimeRange onChange={handleTimeRangeChange} />
            </div>
          </div>

          <div
            className=" table-responsive border"
            style={{
              overflow: 'auto',
              height: 240,
              flexShrink: 0,
              width: 420,
            }}
          >
            <table id="tidxx" className="table table-hover position-relative">
              <thead
                className="border border-white position-sticky top-0"
                style={{ backgroundColor: '#3498DB' }}
              >
                <tr style={{ color: 'white' }}>
                  <th>Pipeline Name</th>
                  <th>Failure Count</th>
                </tr>
              </thead>
              <tbody>
                {data.adf_pipelines_failure.failed_pipelines.map((value) => (
                  <tr>
                    <td>{value.name}</td>
                    <td>{value.failure_count}</td>
                  </tr>
                ))}

                {data.airflow_pipelines_failure.failed_pipelines.map(
                  (value) => (
                    <tr>
                      <td>{value.dag_id}</td>

                      <td>{value._value}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-4 ml-3" style={{ width: 300, marginLeft: 20 }}>
          <h4>Pipeline Executions</h4>
          <div className="p-2 border" style={{ height: 240 }}>
            <PieChart
              dataList={[
                data.adf_pipelines_success.success_count +
                  data.airflow_pipelines_success.success_count,
                data.adf_pipelines_failure.failure_count +
                  data.airflow_pipelines_failure.failure_count,
              ]}
            />

            {/* <DonutChart data={data.metricSources} /> */}
          </div>
        </div>
      </div>
      <hr />
      <div className="m-3">
        <h4>Pipeline Summary</h4>
        <ADFPipelines />
      </div>
       <div className="row m-2">
         <div>
          <h4>Alerts</h4>
          <table
            className="table table-hover position-relative"
            id="alert_table"
          >
            <thead
              className="border border-white position-sticky top-0"
              style={{ backgroundColor: '#3498DB' }}
            >
              <tr style={{ color: 'white' }}>
                <th>Name</th>
                <th>Duration</th>
                <th>Group</th>
                <th>Last Evaluation</th>
                <th>State</th>
                <th>Active At</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {data.alerts.map((value) => (
                <tr>
                  <td>{value.rule_name}</td>
                  <td>{secondsToHms(value.duration)}</td>
                  <td>{value.group_name}</td>
                  <td>{myFunction(value.last_evaluation)}</td>
                  <td>
                    {value.state.charAt(0).toUpperCase() + value.state.slice(1)}
                  </td>
                  <td>{myFunction(value.active_at)}</td>
                  <td>
                    <Button
                      className="me-2"
                      size="small"
                      onClick={() => handleViewStateHistory(value)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <hr />
      <div className="mt-3">
          <h4> Error Logs (Last 24 Hours)</h4>
          <Fluentd />
        </div>
    </>
  )
}
