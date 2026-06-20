import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
// import { Grid } from "@progress/kendo-react-grid";
import { Button } from '@progress/kendo-react-buttons'
// import { useForm } from "react-hook-form";
import { Input } from '@progress/kendo-react-inputs'

function AzureMonitor() {
  const { id } = useParams()
  const [targetDetail, setTargetDetail] = useState({})

  // const handleSelect = (e) => {
  //   setTargetDetail(e.targetDetail);
  // };
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/config/metric_source/${id}/`)
      .then((res) => {
        console.log(res.data)
        setTargetDetail(res.data.value)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [id])

  const handleMetricSourceSave = (e) => {
    e.preventDefault()
    const param = {
      id: targetDetail?.id,
      configured_value: targetDetail?.default_config,
    }

    console.log(param)
    axios({
      method: 'put',
      url: `http://localhost:8000/api/config/metric_source/`,
      headers: '',
      data: param,
    }).then((res) => {
      console.log(res.data)
      alert(targetDetail?.source_name + '  credentials saved successfully')
    })
  }

  return (
    <div className="">
      <h3 id="heading" align="left">
        {targetDetail?.source_name}
      </h3>

      <hr />
      <br />

      <form onSubmit={handleMetricSourceSave}>
        {targetDetail?.default_config?.inputFields.map((inputData) => {
          return (
            <div key={inputData.name} className="m-2">
              <label style={{ width: 200 }}>{inputData.label}</label>
              <Input
                // type={inputData.html_element}
                name={inputData.name}
                required={inputData.isRequired}
                defaultValue={inputData.defaultValue}
                placeholder={inputData.placeholder}
                onChange={(e) => (inputData.value = e.target.value)}
              />
            </div>
          )
        })}
        <div style={{ marginTop: 8, marginLeft: 500 }}>
          <Button type="submit" themeColor={'primary'}>
            Save
          </Button>

          <Button
            type="reset"
            themeColor={'primary'}
            style={{ marginLeft: 10 }}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}
export default AzureMonitor
