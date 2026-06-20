import { Button } from '@progress/kendo-react-buttons'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { Input, TextArea } from '@progress/kendo-react-inputs'
import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
// import { Link } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// import { Navbar, Nav } from "react-bootstrap";
// import { SaveButton, CancelButton } from "../../components/Buttons/buttons";
import Swal from 'sweetalert2'

function HandleBack() {
  window.history.go(-1)
}

function Alertinput() {
  const [data, setData] = useState({
    alerts: [],
  })
  const [sourceList, setSourceList] = useState(["Loading.."]);
  const [source, setSource] = useState(sourceList[0]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/grafana/alertlist/')
      .then((res) => {
        console.log(res.data.data.groups)
        setData((prevState) => ({
          ...prevState,
          alerts: res.data.data.groups,
        }))
      })
      .catch()
  }, [])

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/grafana/alertdatasourceuid/")
      .then((res) => {
        console.log(res.data);
        var datauid = res.data.map(function (element) {
          return element.uid;
        });
        console.log(datauid);
        setSourceList(datauid);
        setSource(datauid[0]);
      })
      .catch();
  }, []);

  axios.delete('http://localhost:8000/api/grafana/alertlist/').then((res) => {})
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const {
      name,
      folder,
      group,
      datasource,
      query,
      threshold,
    } = Object.fromEntries(formData)

    const { data } = await axios.get(
      `http://localhost:8000/api/grafana/rules/${folder}/${group}/`,
    )

    const newRule = {
      grafana_alert: {
        title: name,
        condition: 'B',
        data: [
          {
            refId: 'A',
            datasourceUid: datasource,
            queryType: '',
            relativeTimeRange: {
              from: 600,
              to: 0,
            },
            model: {
              refId: 'A',
              hide: false,
              query,
            },
          },
          {
            refId: 'B',
            datasourceUid: '-100',
            queryType: '',
            model: {
              refId: 'B',
              hide: false,
              type: 'classic_conditions',
              datasource: {
                uid: '-100',
                type: '__expr__',
              },
              conditions: [
                {
                  type: 'query',
                  evaluator: {
                    params: [threshold],
                    type: 'gt',
                  },
                  operator: {
                    type: 'and',
                  },
                  query: {
                    params: ['A'],
                  },
                  reducer: {
                    params: [],
                    type: 'last',
                  },
                },
              ],
            },
          },
        ],
      },
      for: '5m',
      annotations: {},
      labels: {},
    }

    data.rules.push(newRule)
    console.log(data)

    const res = await axios.post(
      `http://localhost:8000/api/grafana/rules/${folder}/`,
      data,
    )
    console.log(res.data)
    // window.alert(res.data.message);

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Alert rule created successfully',

      showConfirmButton: false,
      timer: 1500,
    })
  }

  return (
    <div>
      <div className="row m-2">
        <h4>Create Alert Rule</h4>
        <hr />
      </div>

      <form onSubmit={handleSubmit} style={{ width: 520 }}>
        <div className="m-2">
          <label>Rule Name:</label>
          <Input
            name="name"
            placeholder="Enter Rule name"
            style={{ width: '100%' }}
            required
          />
        </div>
        <div className="m-2">
          <label>Folder:</label>
          <Input
            name="folder"
            placeholder="Enter Rule folder"
            defaultValue={'AlertFolder'}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div className="m-2">
          <label>Group:</label>
          <Input
            name="group"
            placeholder="Enter Rule group name"
            defaultValue={'AlertGroup'}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div className="m-2">
          <label>DataSource UID:</label>
          <DropDownList
            name="datasource"
            data={sourceList}
            value={source}
            style={{ width: "100%" }}
            required
          />
        </div>
        <div className="m-2">
          <label>Metrics Query:</label>
          <TextArea
            name="query"
            placeholder="Write your Query here"
            rows={5}
            defaultValue={`from(bucket: "my-bucket")
|> range(start: v.timeRangeStart, stop:v.timeRangeStop)
|> filter(fn: (r) => r._measurement == "prometheus_remote_write" and r._field == "af_agg_dagbag_size")`}
            style={{ width: '100%', borderColor: 'grey' }}
            required
            spellCheck={false}
          />
        </div>
        <div className="m-2">
          <label>Alert Condition:</label>
          <div className="border border-dark rounded p-1">
            <span className="me-1">WHEN</span>
            <DropDownList
              className="me-1"
              defaultValue="LAST()"
              data={['LAST()']}
              style={{ width: 100 }}
            />
            <span className="me-1">OF THE QUERY</span>
            <DropDownList
              className="me-1"
              defaultValue={'IS ABOVE'}
              data={['IS ABOVE']}
              style={{ width: 120 }}
            />
            <Input
              className="me-1"
              name="threshold"
              type="number"
              defaultValue={3}
              style={{ width: 100 }}
              required
            />
          </div>
        </div>
        <div className="m-2 text-center">
          <Button type="submit" id="btn">
            Submit
          </Button>
          &ensp;
          <Button type="cancel" id="btn" onClick={HandleBack}>
            Cancel
          </Button>
        </div>
      </form>
      <br />
    </div>
  )
}

export default Alertinput
