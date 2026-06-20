import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";
import { Checkbox } from "@mui/material";

function CreateSuite({ show, onHide, loadSuiteList }) {
  const handleClose = onHide;
  const [checked, setChecked] = React.useState(true);
  const [selectedProject, setSelectedProject] = useState();
  const [projectList, setProjectList] = useState([
    { project_name: "Loading.." },
  ]);

  const handleCreateSuite = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    const suite_data = create_suite_model;
    suite_data.suite_name = formData.get("suite_name");
    suite_data.is_active = formData.get("isactive");
    suite_data.project_id = formData.get("project_name");

    formData = new FormData();
    formData.append("create_suite_data", JSON.stringify(suite_data));
    axios
      .post(`${ge_api_url}/ge/create_suite/`, formData)
      .then((res) => {
        console.log(res);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: "Suite  " + suite_data.suite_name + " already exists !",
          });
        } else {          
          Swal.fire({
            icon: "success",
            title: "Save Success",
            text: "Suite " + suite_data.suite_name + " created successfully !",
          });
          onHide();
          loadSuiteList(res.data.createsuite);
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create suite " + suite_data.suite_name + " !",
        });
      });
  };

  const loadProjects = () => {
    axios
      .get(`${ge_api_url}/ge/list_active_projects/`)
      .then((res) => {
        if (res.data.projectlist.length === 0) {
          document.getElementById("project_name").style.color = "grey";
          setProjectList([{ project_name: "No project found" }]);
          setSelectedProject("None");
        } else {
          setProjectList(res.data.projectlist);
          setSelectedProject(res.data.projectlist?.[0].project_name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectProject = (e) => {
    setSelectedProject(e.target.value);
  };

  useEffect(() => {    
    loadProjects();
  }, [show]);

  return (
    <Modal show={show} size="lg" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create a suite</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateSuite} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Suite Name</label>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                placeholder="Enter suite name"
                name="suite_name"
                required
              />
            </div>
          </div>
          
          <div className="row mb-3">
              <div className="col-4">
                <label className="form-label">Project</label>
              </div>
              <div className="col-8">
              <select
                className="form-select"
                name="project_name"
                id="project_id"
                onChange={handleSelectProject}
              >
                {projectList.map(({ project_name, project_id }) => (
                  <option key={project_name} value={project_id}>
                    {project_name}
                  </option>
                ))}
              </select>
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

export default CreateSuite;

const create_suite_model = {
  suite_name: "suite - name",
  is_active: true,
  project_id: 0
};
