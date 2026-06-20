import React, { useState } from "react";
import {
  LocalFileForm,
  AzureStorageForm,
  ApacheKafkaForm,
  DatabaseForm,
} from "./datasource_forms";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";

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

function CreateDatasource({
  openCreateModal = false,
  setOpenCreateModal = () => {},
  onDatasourceCreated = () => {},
}) {
  const [datasourceForm, setDatasourceForm] = useState({ jsx: LocalFileForm });

  const handleDatasourceType = (e) => {
    setDatasourceForm({
      jsx: datasourceTypes.find(({ value }) => value === e.target.value).jsx,
    });
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setDatasourceForm({ jsx: LocalFileForm });
  };

  const handleCreateDatasource = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    console.log(formData);
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
        } else {
          onDatasourceCreated(res.data.datasources);
          Swal.fire({
            icon: "success",
            title: "Created Successfully...",
            text: "Datasource " + formData.get("name") + " created !",
          });
          handleCloseModal();
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to create datasource " + formData.get("name") + " !",
        });
      });
  };
  //
  return (
    <Modal show={openCreateModal} size="lg" onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Datasource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateDatasource}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Datasource Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter datasource name"
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label className="form-label">Datasource Type</label>
              <select
                name="datasource_type"
                className="form-select"
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
          <div className="mb-3">
            <datasourceForm.jsx />
          </div>
          <div className="d-flex justify-content-end">
            <Button
              className="me-3"
              type="submit"
              variant="primary"
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
            >
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateDatasource;
