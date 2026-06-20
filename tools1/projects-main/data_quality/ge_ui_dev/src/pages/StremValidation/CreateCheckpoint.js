import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ge_api_url } from "../../config/api";

function CreateCheckpoint({
  modal = {},
  setModal = () => {},
  onClose = () => {},
}) {
  const { show, data } = modal;
  const [datasourceList, setDatasourceList] = useState([]);
  const [expectatioSuiteList, setExpectationSuiteList] = useState([]);

  const handleClose = () => {
    setModal({
      show: false,
      data: null,
    });
    onClose();
  };

  const getDatasourceList = () => {
    axios
      .get(`${ge_api_url}/ge/list_datasources/`)
      .then((res) => {
        console.log(res.data);
        setDatasourceList(res.data.datasources);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getExpectationSuiteList = () => {
    axios
      .get(`${ge_api_url}/ge/list_expectation_suites/`)
      .then((res) => {
        console.log(res.data);
        setExpectationSuiteList(res.data.suite_list);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCreateCheckpoint = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    axios
      .post(ge_api_url + "/ge/create_stream_checkpoint/", formData)
      .then((res) => {
        console.log(res);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getDatasourceList();
    getExpectationSuiteList();
  }, []);

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <ModalHeader closeButton>
          <ModalTitle>StreamData Checkpoint</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleCreateCheckpoint}>
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label">Checkpoint name</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  name="checkpoint_name"
                  placeholder="Enter checkpoint name"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label">Datasource name</label>
              </div>
              <div className="col-8">
                <select className="form-select" name="datasource_name">
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
                <label className="form-label">Expectation suite</label>
              </div>
              <div className="col-8">
                <select className="form-select" name="expectation_suite_name">
                  {expectatioSuiteList.map(({ expectation_suite_name }) => (
                    <option value={expectation_suite_name}>
                      {expectation_suite_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex">
              <Button
                className="ms-auto me-2"
                type="submit"
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
              >
                Submit
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CreateCheckpoint;
