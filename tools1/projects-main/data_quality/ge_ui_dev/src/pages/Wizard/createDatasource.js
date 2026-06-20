import React, { useState, useEffect } from "react";
import {
  LocalFileForm,
  AzureStorageForm,
  ApacheKafkaForm,
  DatabaseForm,
} from "../Datasource/datasource_forms";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Backdrop, CircularProgress } from "@mui/material";

const datasourceTypes = [
  {
    text: "Local file",
    value: "local_file",
    jsx: LocalFileForm,
  },
  {
    text: "Azure Storage",
    value: "azure_storage",
    jsx: AzureStorageForm,
  },
  // {
  //   text: "Apache Kafka",
  //   value: "apache_kafka",
  //   jsx: ApacheKafkaForm,
  // },
  {
    text: "Database",
    value: "database",
    jsx: DatabaseForm,
  },
];

function CreateNewDatasource({ onDatasourceCreated = () => {} }) {
  const [datasourceForm, setDatasourceForm] = useState({ jsx: LocalFileForm });
  const [dataAssetList, setDataAssetList] = useState([]);
  const [runChecking, setRunChecking] = useState(false);
  const [selectedDataAssets, setSelectedDataAssets] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [nextDisable, setNextDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleDatasourceType = (e) => {
    setDatasourceForm({
      jsx: datasourceTypes.find(({ value }) => value === e.target.value).jsx,
    });
  };

  const handleCreateNewDatasource = (e) => {
    e.preventDefault();
    setRunChecking(true);
    var formData = new FormData(e.target);
    //
    axios
      .post(`${ge_api_url}/ge/create_datasource/`, formData)
      .then((res) => {
        console.log(res);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Datasource " + formData.get("name") + " already exists !",
          });
          setRunChecking(false);
        } else {
          onDatasourceCreated(res.data.datasources);
          Swal.fire({
            icon: "success",
            title: "Created Successfully...",
            text: "Datasource " + formData.get("name") + " created !",
          });
          axios
            .post(`${ge_api_url}/ge/insert_to_wizard/`, formData)
            .then((res) => {
              console.log(res);
              var ds = formData.get("name");
              loadDataAssets(ds);
              toast.success("Connected Successfully !", {
                autoClose: 1000,
              });
              setRunChecking(false);
            })
            .catch((err) => {
              toast.error("Failed to connect Datasource !", {
                autoClose: 1000,
              });
              setRunChecking(false);
            });
        }
      })
      .catch((err) => {
        toast.error("Failed to Create Datasource !", { autoClose: 1000 });
        setRunChecking(false);
      });
  };

  const loadDataAssets = (datasource_name) => {
    axios
      .get(`${ge_api_url}/ge/list_data_assets/${datasource_name}/`)
      .then((res) => {
        console.log(res);
        setDataAssetList(res.data.data_assets);
        setCheckedState(new Array(res.data.data_assets.length).fill(false));
        document.getElementById("all_assets_create_page").style.display = "";
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to fetch data assets !", { autoClose: 1000 });
      });
  };

  const handleChange = (position) => {
    const updatedCheckedState = new Array(dataAssetList.length).fill(false);
    checkedState.map((item, index) => {
      if (index === position) {
        updatedCheckedState[index] = !item;
      } else {
        updatedCheckedState[index] = item;
      }
    });
    setCheckedState(updatedCheckedState);
    forNextButton(updatedCheckedState);
  };

  const forNextButton = (checked_arr) => {
    if (checked_arr.includes(true)) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(checkedState);
    var updatedSelectedElements = new Array();
    checkedState.map((item, index) => {
      if (item === true) {
        var data_asset = dataAssetList[index];
        updatedSelectedElements.push(data_asset);
      }
    });
    var uniqueArray = [...new Set(updatedSelectedElements)];
    setSelectedDataAssets(uniqueArray);
    updateWizardData(uniqueArray);
  };

  const updateWizardData = (selected_assets) => {
    console.log(selected_assets);
    const json_converted = JSON.stringify({ list: selected_assets });

    var ds = document.getElementById("datasource_name_create").value;
    const body = {
      datasource_name: ds,
      selectedDataAssets: json_converted,
      current_page: "profiling",
      status: "in-progress",
    };
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    axios
      .post(`${ge_api_url}/ge/update_asset_to_wizard/`, formData)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          document.getElementById("next").click();
        }, 1000);
        // setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Connection Failed !!", { autoClose: 1000 });
        setRunChecking(false);
        setLoading(false);
      });
  };

  return (
    <div>
      <div>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <form onSubmit={handleCreateNewDatasource}>
          <div className="row">
            <div className="row mb-3">
              <label className="form-label col">Datasource Name</label>
              <div className="col-10">
                <input
                  type="text"
                  name="name"
                  id="datasource_name_create"
                  placeholder="Enter datasource name"
                  className="form-control col"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="form-label col">Datasource Type</label>
              <div className="col-10">
                <select
                  name="datasource_type"
                  className="form-select col"
                  onChange={handleDatasourceType}
                >
                  {datasourceTypes.map(({ text, value }) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mb-2 ps-2 pe-3">
            <datasourceForm.jsx />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              type="submit"
              variant="primary"
              disabled={runChecking}
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
            >
              {runChecking ? (
                <>
                  <Spinner
                    className="me-1"
                    as="span"
                    animation="grow"
                    size="sm"
                  />
                  Creating & Checking...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            {/* <Button
              className="me-2"
              variant="primary"
              id="check_connection_button_create_page"
              disabled={runChecking}
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
              onClick={handleCheckConnection}
            >
              {runChecking ? (
                <>
                  <Spinner
                    className="me-1"
                    as="span"
                    animation="grow"
                    size="sm"
                  />
                  Checking...
                </>
              ) : (
                "Check Connection"
              )}
            </Button> */}
          </div>
        </form>

        <div id="all_assets_create_page" style={{ display: "none" }}>
          <label>
            <b>Select Data Asset</b>
          </label>
          <form onSubmit={handleSubmit}>
            {dataAssetList.length === 0 ? (
              <label style={{ color: "red" }}>No data asset found !</label>
            ) : (
              dataAssetList.map((value, index) => (
                <div className="p-2 mb-3 border sm" style={{ width: 400 }}>
                  <label name={value}>
                    <input
                      style={{ borderRadius: 12, backgroundColor: "orangered" }}
                      type={"checkbox"}
                      name={value}
                      checked={checkedState[index]}
                      onChange={() => handleChange(index)}
                    />
                    &emsp;
                    {value}
                  </label>
                </div>
              ))
            )}
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                type="submit"
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
                disabled={nextDisable}
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNewDatasource;
