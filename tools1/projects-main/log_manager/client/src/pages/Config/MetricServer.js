import React, { useEffect, useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import Editor from "@monaco-editor/react";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import swal from "sweetalert";

function MetricServer() {
  const [promConfig, setPromConfig] = useState({});

  const getPromConfig = () => {
    axios
      .get("http://localhost:8000/api/config/prometheus/")
      .then((res) => {
        console.log(res.data);
        setPromConfig(JSON.parse(res.data.config.value));
      })
      .catch((err) => console.log(err));
  };

  const handlePromConfigChange = (config_yml) => {
    // console.log(newValue);
    setPromConfig({ ...promConfig, config_yml });
  };

  const handlePromConfigSave = () => {
    const formData = new FormData();
    formData.append("config_name", "prometheus");
    formData.append("value", JSON.stringify(promConfig));
    formData.append("format", "json");
    axios
      .post("http://localhost:8000/api/config/", formData)
      .then((res) => {
        console.log(res.data);
        // alert("Changes saved successfully!");
        swal({
          title: "Mertics Server",
          text: "Saved",
          icon: "success",
          button: "Ok",
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPromConfig();
  }, []);
  return (
    <div>
      <div className="row m-2">
        <div className="col-3">
          <label>Proamtheus Url:</label>
        </div>
        <div className="col-9">
          <Input
            name="url"
            placeholder="Enter prometheus Url"
            value={promConfig.url}
            onChange={(e) =>
              setPromConfig({ ...promConfig, url: e.target.value })
            }
            style={{ width: 400 }}
          />
        </div>
      </div>
      <div className="row m-2">
        <div className="col-3">
          <div>Prometheus.yml:</div>
        </div>
        <div
          className="col-9"
          style={{
            width: 400,
            height: "300px",
            border: "1px solid lightgrey",
            marginTop: 8,
            marginLeft: 12,
          }}
        >
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            defaultLanguage="yaml"
            onChange={handlePromConfigChange}
            value={promConfig.config_yml}
          />
        </div>
        <div style={{ marginTop: 8 }} className="text-center">
          <Button onClick={handlePromConfigSave} id="btn">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MetricServer;
