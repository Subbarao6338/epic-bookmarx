import React, { useEffect, useState } from "react";
import { Label } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
// import SweetAlert from "sweetalert-react";
import swal from "sweetalert";
import axios from "axios";

function MetricStorage() {
  const [config, setConfig] = useState({});
  function handleFormSumit(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    const config = JSON.stringify(Object.fromEntries(formData));
    formData = new FormData();
    formData.append("config_name", "metric_storage");
    formData.append("format", "json");
    formData.append("value", config);

    axios
      .post("http://localhost:8000/api/config/", formData)
      .then((res) => {
        console.log(res);
        // alert("configuration saved");
        swal({
          title: "Mertics Storage",
          text: "Saved",
          icon: "success",
          button: "Ok",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function loadConfiguration() {
    axios
      .get("http://localhost:8000/api/config/metric_storage/")
      .then((res) => {
        console.log(res.data);
        const config_value = JSON.parse(res.data.config.value);
        setConfig({ ...config_value, loaded: true });
      })
      .catch((err) => {
        console.log(err);
        setConfig({ loaded: true });
      });
  }

  useEffect(() => {
    loadConfiguration();
  }, []);

  return (
    <div>
      {config.loaded ? (
        <form onSubmit={handleFormSumit}>
          <div className="row m-2">
            <div className="col-3">
              <Label>InfluxDB URL:</Label>
            </div>
            <div className="col-9">
              <Input
                name="url"
                placeholder="Enter Influxdb url"
                defaultValue={config.url}
                // style={{ width: '100%' }}
                required
              />
            </div>
          </div>
          <div className="row m-2">
            <div className="col-3">
              <Label>Organization:</Label>
            </div>
            <div className="col-9">
              <Input
                name="org"
                placeholder="Influxdb organization"
                defaultValue={config.org}
                // style={{ width: '100%' }}
                required
              />
            </div>
          </div>
          <div className="row m-2">
            <div className="col-3">
              <Label>Bucket Name:</Label>
            </div>
            <div className="col-9">
              <Input
                name="bucket"
                placeholder="Influxdb Bucket"
                defaultValue={config.bucket}
                // style={{ width: '100%' }}
                required
              />
            </div>
          </div>
          <div className="row m-2">
            <div className="col-3">
              <Label>Token:</Label>
            </div>
            <div className="col-9">
              <Input
                name="token"
                placeholder="API token"
                defaultValue={config.token}
                // style={{ width: '100%' }}
                required
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
  );
}

export default MetricStorage;
