import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import CreateNewDatasource from "./createDatasource";
// import SelectInput from '@mui/material/Select/SelectInput'
import { PlusCircle, PatchCheck } from "react-bootstrap-icons";
import { Backdrop, CircularProgress } from "@mui/material";

toast.configure();
function CreateDatasource({ onDatasourceCreated = () => {} }) {
  const [datasourceList, setDatasourceList] = useState([
    { datasource_name: "Loading.." },
  ]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const [selectedDatasource, setSelectedDatasource] = useState();
  const [formContentOpenStatus, setFormContentOpenStatus] = useState(false);
  const [runChecking, setRunChecking] = useState(false);
  const [selectedDataAssets, setSelectedDataAssets] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [selectedDatasourceDetail, setSelectedDatasourceDetail] = useState({
    json: { name: "local", datasource_type: "Local File" },
  });
  const [loading, setLoading] = useState(false);
  const [nextDisable, setNextDisable] = useState(true);

  const loadDatasources = () => {
    axios
      .get(`${ge_api_url}/ge/list_datasources/`)
      .then((res) => {
        if (res.data.datasources.length === 0) {
          document.getElementById("datasource_name").style.color = "grey";
          setDatasourceList([{ datasource_name: "No datasource found" }]);
          setSelectedDatasource("None");
        } else {
          setDatasourceList(res.data.datasources);
          setSelectedDatasource(res.data.datasources?.[0].datasource_name);
        }

        // loadDataAssets(res.data.datasources?.[0].datasource_name);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectDatasource = (e) => {
    setSelectedDatasource(e.target.value);
    document.getElementById("all_assets").style.display = "none";
    // loadDataAssets(e.target.value);
  };

  const loadDataAssets = (datasource_name) => {
    axios
      .get(`${ge_api_url}/ge/list_data_assets/${datasource_name}/`)
      .then((res) => {
        console.log(res);
        setDataAssetList(res.data.data_assets);
        setCheckedState(new Array(res.data.data_assets.length).fill(false));
        document.getElementById("all_assets").style.display = "";
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateNewDatasource = () => {
    setFormContentOpenStatus(!formContentOpenStatus);
    document.getElementById("all_assets").style.display = "none";
    // loadDatasources();
    if (formContentOpenStatus === true) {
      document.getElementById("form_content").style.display = "none";
      document.getElementById("check_connection_button").style.display = "";
    } else {
      document.getElementById("form_content").style.display = "";
      document.getElementById("check_connection_button").style.display = "none";
    }
  };

  const loadDatasourceDetails = (datasource_name) => {
    axios
      .get(`${ge_api_url}/ge/get_datasource_detail/${datasource_name}/`)
      .then((res) => {
        console.log(res);
        const ds_details = {
          json: JSON.parse(res.data.detail.json),
          value: JSON.parse(res.data.detail.value),
        };
        console.log(ds_details);
        setSelectedDatasourceDetail(ds_details);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCheckConnection = () => {
    setRunChecking(true);
    setLoading(true);
    if (selectedDatasource) {
      loadDatasourceDetails(selectedDatasource);
      loadDataAssets(selectedDatasource);
      const body = {
        name: selectedDatasource,
      };
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, value);
      });

      axios
        .post(`${ge_api_url}/ge/insert_to_wizard/`, formData)
        .then((res) => {
          console.log(res);
          setRunChecking(false);
          setLoading(false);
          toast.success("Connected Successfully !", { autoClose: 1000 });
        })
        .catch((err) => {
          setRunChecking(false);
          setLoading(false);
          toast.error("Failed to Connect Datasource !", { autoClose: 1000 });
        });
    } else {
      toast.warning("Please Select/Create Datasource", { autoClose: 1000 });
      setRunChecking(false);
      setLoading(false);
    }
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
    console.log(checkedState);
    setLoading(true);
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
    const body = {
      datasource_name: selectedDatasource,
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
        // alert('Selected Successfully !!')
        setTimeout(() => {
          document.getElementById("next").click();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Connection Failed !!", { autoClose: 1000 });
        setRunChecking(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDatasources();
  }, []);
  //
  return (
    <div>
      <h5 className="mb-2 p-1 fw-bold">Datasource</h5>
      <div className="row mb-3">
        <div className="col-2 p-1 ms-3">
          <label className="form-label">Select Datasource : </label>
        </div>
        <div className="col-6">
          <select
            className="form-select"
            name="datasource_name"
            id="datasource_name"
            onChange={handleSelectDatasource}
          >
            {datasourceList.map(({ datasource_name }) => (
              <option key={datasource_name} value={datasource_name}>
                {datasource_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3 text-end">
          <Button
            variant="primary"
            className="me-3"
            id="check_connection_button"
            disabled={runChecking}
            title="Check Connection"
            style={{
              backgroundColor: "orangered",
              borderColor: "orangered",
            }}
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
              <PatchCheck color="white" size={20} />
            )}
          </Button>
          &emsp;
          <Button
            type="submit"
            title="Create DataSource"
            variant="primary"
            style={{
              backgroundColor: "orangered",
              borderColor: "orangered",
              marginRight: -65,
            }}
            onClick={handleCreateNewDatasource}
          >
            <PlusCircle color="white" size={20} />
          </Button>
        </div>
      </div>
      <div></div>
      <div
        id="form_content"
        className="border p-2 m-2"
        style={{ display: "none" }}
      >
        <CreateNewDatasource />
      </div>
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <div id="all_assets" className="m-3" style={{ display: "none" }}>
        <h6 className="fw-bold"> Datasource Details</h6>
        <table className="table table-bordered table-sm" style={{ width: 500 }}>
          <tbody>
            <tr>
              <td width={"auto"}>
                <b>Name </b>
              </td>
              <td width={"auto"}>{selectedDatasource}</td>
            </tr>
            <tr>
              <td>
                <b>Type </b>
              </td>
              <td>{selectedDatasourceDetail.json.datasource_type}</td>
            </tr>
            {selectedDatasourceDetail.json.datasource_type === "database" && (
              <tr>
                <td>
                  <b>Database Type </b>
                </td>
                <td>{selectedDatasourceDetail.json.database_name}</td>
              </tr>
            )}
            {selectedDatasourceDetail.json.datasource_type === "database" && (
              <tr>
                <td>
                  <b>Connection String </b>
                </td>
                <td>
                  {
                    selectedDatasourceDetail.value.execution_engine
                      .connection_string
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
  );
}

export default CreateDatasource;
