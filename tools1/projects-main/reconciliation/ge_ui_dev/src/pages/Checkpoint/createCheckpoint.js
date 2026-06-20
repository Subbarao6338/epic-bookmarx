import React, { Fragment, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";

function CreateModal({ show, onHide, loadCheckpointDetail }) {
  const [suiteList, setSuiteList] = useState([]);
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const handleClose = onHide;

  const loadSuiteList = () => {
    axios
      .get(`${ge_api_url}/ge/list_expectation_suites/`)
      .then((res) => {
        console.log(res);
        setSuiteList(res.data.suite_list);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(loadDatasources);
  };

  const loadDatasources = () => {
    axios
      .get(`${ge_api_url}/ge/list_datasources/`)
      .then((res) => {
        console.log(res);
        setDatasourceList(res.data.datasources);
        loadDataAssets(res.data.datasources[0].datasource_name);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadDataAssets = (datasource_name) => {
    axios
      .get(`${ge_api_url}/ge/list_data_assets/${datasource_name}/`)
      .then((res) => {
        console.log(res);
        setDataAssetList(res.data.data_assets);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateCheckpoint = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    console.log(...formData);
    const checkpoint_config = checkpoint_config_template;
    checkpoint_config.name = formData.get("checkpoint_name");
    checkpoint_config.run_name_template =
      formData.get("checkpoint_name") + "-%Y%m%d-%H%M%S";
    checkpoint_config.validations[0].expectation_suite_name =
      formData.get("suite_name");
    checkpoint_config.validations[0].batch_request.datasource_name =
      formData.get("datasource_name");
    checkpoint_config.validations[0].batch_request.data_asset_name =
      formData.get("data_asset");

    formData = new FormData();
    formData.append("checkpoint_config", JSON.stringify(checkpoint_config));
    axios
      .post(`${ge_api_url}/ge/create_checkpoint/`, formData)
      .then((res) => {
        console.log(res);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Checkpoint " + checkpoint_config.name + " already exists !",
          });
        } else {
          loadCheckpointDetail(res.data.checkpoint_detail);
          Swal.fire({
            icon: "success",
            title: "Created Successfully...",
            text: "Checkpoint " + checkpoint_config.name + " created !",
          });
          onHide();
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to create checkpoint " + checkpoint_config.name + " !",
        });
      });
  };

  useEffect(() => {
    show && loadSuiteList();
  }, [show]);

  return (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create a checkpoint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateCheckpoint} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Checkpoint Name</label>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                placeholder="Enter checkpoint name"
                name="checkpoint_name"
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Select Expectation Suite</label>
            </div>
            <div className="col-8">
              <select className="form-select" name="suite_name">
                {suiteList.map(({ expectation_suite_name }) => (
                  <option
                    key={expectation_suite_name}
                    value={expectation_suite_name}
                  >
                    {expectation_suite_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Select a Datasource Type</label>
            </div>
            <div className="col-8">
              <select className="form-select" name="datasource_type">
                <option>Upload file</option>
                <option>Local File</option>
                <option>Azure Storage</option>
              </select>
            </div>
          </div> */}
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Select Datasource</label>
            </div>
            <div className="col-8">
              <select
                className="form-select"
                name="datasource_name"
                onChange={(e) => loadDataAssets(e.target.value)}
              >
                {datasourceList.map(({ datasource_name }) => (
                  <option key={datasource_name} value={datasource_name}>
                    {datasource_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Select Data Asset</label>
            </div>
            <div className="col-8">
              <select className="form-select" name="data_asset">
                {dataAssetList.map((asset_name) => (
                  <option key={asset_name} value={asset_name}>
                    {asset_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-end">
            <Button
              className="me-2"
              type="submit"
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateModal;

const checkpoint_config_template = {
  name: "your_checkpoint_name",
  config_version: 1,
  class_name: "SimpleCheckpoint",
  run_name_template: "my-run-name-%Y%m%d-%H%M%S",
  validations: [
    {
      batch_request: {
        datasource_name: "your_datasource_name",
        data_connector_name: "default_inferred_data_connector_name",
        data_asset_name: "your_data_asset_name",
        data_connector_query: {
          index: -1,
        },
      },
      expectation_suite_name: "expectation_suite_name",
    },
  ],
};
