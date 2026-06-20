import React, { Fragment, useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";

function RunValidation({
  openNewValidation,
  setOpenNewValidation,
  onRunComplete,
}) {
  const [suiteList, setSuiteList] = useState([]);
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const [runLoading, setRunLoading] = useState(false);

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

  const handleRunValidation = (e) => {
    e.preventDefault();
    // loading button
    setRunLoading(true);
    var formData = new FormData(e.target);
    console.log(...formData);

    const expectation_suite_name = formData.get("suite_name");
    const batch_request = {
      datasource_name: formData.get("datasource_name"),
      data_connector_name: "default_inferred_data_connector_name",
      data_asset_name: formData.get("data_asset"),
    };
    const checkpoint_config = {
      class_name: "SimpleCheckpoint",
      run_name_template: formData.get("checkpoint_name") + "-%Y%m%d-%H%M%S",
      validations: [
        {
          batch_request: batch_request,
          expectation_suite_name: expectation_suite_name,
        },
      ],
    };

    formData = new FormData();
    formData.append("expectation_suite_name", expectation_suite_name);
    formData.append("checkpoint_config", JSON.stringify(checkpoint_config));
    axios
      .post(`${ge_api_url}/ge/validation/`, formData)
      .then((res) => {
        console.log(res);
        onRunComplete();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setRunLoading(false);
    setOpenNewValidation(false);
  };

  useEffect(() => {
    openNewValidation && loadSuiteList();
  }, [openNewValidation]);

  return (
    <Modal show={openNewValidation} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Run New Validation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleRunValidation} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Validation Run Name</label>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                placeholder="Enter validation run_name"
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
              <label className="form-label">Select Datasource Name</label>
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
              disabled={runLoading}
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
            >
              {runLoading ? (
                <>
                  <Spinner
                    className="me-1"
                    as="span"
                    animation="grow"
                    size="sm"
                  />
                  Running...
                </>
              ) : (
                "Run Validation"
              )}
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

export default RunValidation;
