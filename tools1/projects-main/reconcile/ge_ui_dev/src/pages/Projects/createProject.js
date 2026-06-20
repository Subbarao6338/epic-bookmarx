import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";
import { Checkbox } from "@mui/material";

function CreateProject({ show, onHide, loadProjectList }) {
  const handleClose = onHide;
  const [checked, setChecked] = React.useState(true);

  const handleCreateProject = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    const project_data = create_project_model;
    project_data.project_name = formData.get("project_name");
    project_data.is_active= formData.get("isactive");

    formData = new FormData();
    formData.append("create_project_data", JSON.stringify(project_data));
    axios
      .post(`${ge_api_url}/ge/create_project/`, formData)
      .then((res) => {
        console.log(res);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: "Project  " + project_data.project_name + " already exists !",
          });
        } else {
          loadProjectList(res.data.createproject);
          Swal.fire({
            icon: "success",
            title: "Save Success",
            text: "Project " + project_data.project_name + " created successfully !",
          });
          onHide();
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create project " + project_data.project_name + " !",
        });
      });
  };

  useEffect(() => {    
  }, [show]);

  return (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create a project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateProject} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Project Name</label>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                placeholder="Enter project name"
                name="project_name"
                required
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Status (Active/Inactive)</label>
            </div>
            <div className="col-8">
            <Checkbox              
              value={checked}
              name="isactive"
            />
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

export default CreateProject;

const create_project_model = {
  project_name: "project - name",
  is_active: true,  
};
