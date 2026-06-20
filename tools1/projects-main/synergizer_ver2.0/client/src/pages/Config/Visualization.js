import { Input } from '@progress/kendo-react-inputs'
import { Label } from '@progress/kendo-react-labels'
import { useEffect, useState } from 'react'
import { Button } from '@progress/kendo-react-buttons'
import axios from 'axios'
import swal from 'sweetalert'

function Visualization() {
  const [config, setConfig] = useState({})

  function handleFormSumit(e) {
    e.preventDefault()
    var formData = new FormData(e.target)
    const config = JSON.stringify(Object.fromEntries(formData))
    formData = new FormData()
    formData.append('config_name', 'visualization')
    formData.append('format', 'json')
    formData.append('value', config)

    axios
      .post('http://localhost:8000/api/config/', formData)
      .then((res) => {
        console.log(res)
        // alert("configuration saved");
        swal({
          title: 'Visulization',
          text: 'Saved',
          icon: 'success',
          button: 'Ok',
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function loadConfiguration() {
    axios
      .get('http://localhost:8000/api/config/visualization/')
      .then((res) => {
        console.log(res.data)
        const config_value = JSON.parse(res.data.config.value)
        setConfig({ ...config_value, loaded: true })
      })
      .catch((err) => {
        console.log(err)
        setConfig({ loaded: true })
      })
  }

  useEffect(() => {
    loadConfiguration()
  }, [])

  return (
    <div>
      {config.loaded ? (
        <form onSubmit={handleFormSumit}>
          <div className="row m-2">
            <div className="col-3" style={{ width: '150px' }}>
              <Label className="required">Grafana URL:</Label>
            </div>
            <div className="col-8">
              <Input
                name="url"
                placeholder="Enter Grafana URL"
                defaultValue={config.url}
                // style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="row m-2">
            <div className="col-3" style={{ width: '150px' }}>
              <Label className="required">API Token:</Label>
            </div>
            <div className="col-8">
              <Input
                name="token"
                placeholder="Enter API token"
                defaultValue={config.token}
                // style={{ width: '100%' }}
              />
            </div>
          </div>
          <div className="row m-2">
            <div className="col-3" style={{ width: '150px' }}>
              <Label className="required">Default Embed URL:</Label>
            </div>
            <div className="col-8">
              <Input
                name="default_embed_url"
                placeholder="Enter Embed URL"
                defaultValue={config.default_embed_url}
              />
            </div>
          </div>
          <div className="m-2 text-center">
            <Button type="submit" id="btn">
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div>Loading..</div>
      )}
    </div>
  )
}

export default Visualization
