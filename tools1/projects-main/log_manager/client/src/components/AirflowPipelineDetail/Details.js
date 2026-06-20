import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import DataTable from "datatables.net";

export default function Details() {
  const [data, setData] = useState({
    dags: [],
    dag_runs: [],
    dag_detail: [],
    Airflow_pipelines: [],
  });

  function convertTime(t) {
    let year, month, day, hour, minute, second;

    second = Math.floor(t / 1000);
    minute = Math.floor(second / 60);
    second = second % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    month = Math.floor(day / 30);
    day = day % 30;
    year = Math.floor(month / 12);
    month = month % 12;

    let ret = "0 sec ago";
    if (year === 0 && month === 0 && day === 0 && hour === 0 && minute === 0) {
      ret = second + " sec ago";
    } else if (
      year === 0 &&
      month === 0 &&
      day === 0 &&
      hour === 0 &&
      minute !== 0
    ) {
      ret = minute + " min " + second + " sec ago";
    } else if (year === 0 && month === 0 && day === 0 && hour !== 0) {
      ret = hour + " hrs " + minute + " min ago";
    } else if (year === 0 && month === 0 && day !== 0) {
      ret = day + " days " + hour + " hrs ago";
    } else if (year === 0 && month !== 0) {
      ret = month + " months " + day + " days ago";
    } else if (year !== 0) {
      ret = year + " years " + month + " months ago";
    } else {
      ret = second + " sec ago";
    }
    return ret;
  }

  function myFunction(time) {
    if (time !== "--") {
      var date_now = new Date();
      var given_time = new Date(time);
      var last_updated = date_now.getTime() - given_time.getTime();
      return convertTime(last_updated);
    } else {
      return "--";
    }
  }
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute " : " min ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/airflow/dags/")
      .then((res) => {
        console.log(typeof res.data, res.data);
        debugger;
        console.log(res);
        setData((prevState) => ({
          ...prevState,
          dags: res.data.dags,
        }));
      })
      .catch();

    axios
      .get("http://localhost:8000/api/airflow/dag_runs/")
      .then((res) => {
        console.log(typeof res.data, res.data);
        debugger;
        console.log(res);
        setData((prevState) => ({
          ...prevState,
          dag_runs: res.data.dag_runs,
        }));
      })
      .catch();

    axios
      .get("http://localhost:8000/api/airflow/dag_detail/")
      .then((res) => {
        console.log(typeof res.data, res.data);
        debugger;
        console.log(res);
        setData((prevState) => ({
          ...prevState,
          dag_detail: res.data,
        }));
      })
      .catch();

    axios
      .post("http://localhost:8000/api/influxdb/query/", {
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
        |> aggregateWindow(every: 24h, fn: last, createEmpty: false)
        |> increase()
        |> first()

        join(
          tables: {a, b},
          on: ["dag_id"],
        )`,
      })
      .then((res) => {
        // console.log(res.data);
        const { data } = Papa.parse(res.data, {
          header: true,
          skipEmptyLines: true,
        });
        // console.log(data);
        setData((prevState) => ({ ...prevState, piplines: data }));
      })
      .catch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let table = new DataTable("#airflow_table", {
        destroy: true,
        searching: false,
      });
    }, 7000);
  }, []);

  return (
    <>
      <div className="row m-2">
        {/* <h4>Airflow</h4> */}
        <div className="">
          <table
            className="table table-hover table-sm position-relative m-0"
            id="airflow_table"
            style={{ fontSize: 13 }}
          >
            <thead
              className="position-sticky top-0"
              style={{ backgroundColor: "lightgrey" }}
            >
              <tr style={{ color: "black" }}>
                {/* <th>Pipeline Name</th> */}
                <th>Dag ID</th>
                {/* <th style={{ width: 75 }}>default_view</th> */}
                {/* <th style={{ width: 200 }}>file_token</th> */}
                {/* <th style={{ width: 200 }}>fileloc</th> */}
                <th style={{ width: 150 }}>last_expired</th>
                <th style={{ width: 150 }}>last_parsed_time</th>
                <th style={{ width: 150 }}>max_active_runs</th>
                <th style={{ width: 150 }}>max_active_tasks</th>
                <th style={{ width: 150 }}>next_dagrun</th>
                <th style={{ width: 150 }}>next_dagrun_create_after</th>
                <th style={{ width: 150 }}>next_dagrun_data_interval_end</th>
                {/* <th style={{ width: 200 }}>next_dagrun_create_after</th> */}
                <th style={{ width: 150 }}>next_dagrun_data_interval_start</th>
              </tr>
            </thead>
            <tbody>
              {data.dags.map((value) => (
                <tr>
                  {/* <td>{value.dag_id}</td> */}
                  <td>{value.dag_id}</td>
                  {/* <td>
                    <button
                      className="btn-success"
                      style={{
                        border: 0,
                        padding: "0px 4px 4px 4px",
                        borderRadius: 4
                      }}>
                      {value.state}
                    </button>
                  </td> */}
                  {/* <td>{value.default_view}</td> */}
                  {/* <td>{value.file_token}</td> */}
                  {/* <td>{value.fileloc}</td> */}
                  <td>{value.last_expired}</td>
                  <td>{value.last_parsed_time}</td>
                  <td>{value.max_active_runs}</td>
                  <td>{value.max_active_tasks}</td>
                  <td>{value.next_dagrun}</td>
                  <td>{value.next_dagrun_create_after}</td>
                  <td>{value.next_dagrun_data_interval_end}</td>
                  <td>{value.next_dagrun_data_interval_start}</td>
                  {/* <td>{value.logical_date}</td> */}
                  {/* <td>{value.external_trigger}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
