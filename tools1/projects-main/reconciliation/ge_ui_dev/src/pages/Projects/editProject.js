import React, { Fragment, useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";
import { Checkbox } from "@mui/material";

const EditProject=(props)=>{
  const [projectDetails, setProjectDetails] = useState([]);  
  const navigate = useNavigate();
  const {project_id} = useParams();
  debugger;
  
  const handleUpdateProject = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    const project_data = edit_project_model;
    project_data.project_name = formData.get("project_name");
    project_data.is_active= formData.get("isactive");
    project_data.project_id= formData.get("project_id");

    formData = new FormData();
    formData.append("update_project_data", JSON.stringify(project_data));
    axios
      .post(`${ge_api_url}/ge/update_project/`, formData)
      .then((res) => {
        console.log(res);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: "Project  " + project_data.project_name + " already exists !",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Update Success",
            text: "Project " + project_data.project_name + " updated successfully !",
          });
          handleProjectList();
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update project " + project_data.project_name + " !",
        });
      });
  };

  const loadProjectDetails = () => {
    axios
      .get(`${ge_api_url}/ge/get_project/?project_id=` +project_id)
      .then((res) => {
        setProjectDetails(res.data.project[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleProjectList = () => {
    navigate("/projects")
  };

  useEffect(() => {
    loadProjectDetails();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        <h4 className="text-center border p-1">
          <b>Edit Project</b>
        </h4>

        <div className="m-3">
          <Button
            size="sm"
            onClick={handleProjectList}
            style={{ backgroundColor: "orangered", borderColor: "orangered" }}
          >
            Back to Project List
          </Button>
        </div>
        
        <div className="m-3" style={{ width: "60%" }}>
          {projectDetails !=null ? (
            <form onSubmit={handleUpdateProject} spellCheck={false}>
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label">Project Name</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  placeholder="Enter project name"
                  name="project_name"
                  value={projectDetails.project_name}
                  required
                />
                <input
                  type="hidden"
                  name="project_id"
                  value={projectDetails.project_id}
                />
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label">Status (Active/Inactive)</label>
              </div>
              <div className="col-8">
              <Checkbox              
                checked={projectDetails.isactive==1? true : false}
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
                Update
              </Button>              
            </div>
          </form>
          ) : (
            <span>Project not found to edit !</span>
          )}
        </div>        
      </div>
    </div>
  );
}

export default EditProject;


const edit_project_model = {
  project_name: "project - name",
  project_id:0,
  is_active: true,
};
