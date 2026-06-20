import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateProject from "./createProject";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress, createTheme } from "@mui/material";
import Swal from "sweetalert2";

function Projects() {
  const [openModal, setOpenModal] = useState();
  const [projectDetails, setProjectDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleShow = () => {
    setOpenModal(true);
  };

  const loadProjectList = (projectlist = []) => {
    let list_projects = new Array();
    projectlist.map((item) => {
      const detail_json = {
        project_name: item.project_name,
        project_id: item.project_id,
        isactive: item.isactive
      };
      list_projects.push(detail_json);
    });
    setProjectDetails(list_projects);
    setLoading(false);
  };

  const loadProjectDetails = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/list_projects/`)
      .then((res) => {
        loadProjectList(res.data.projectlist);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleProjectEdit = (project_id) => {
    navigate("/editproject/" +project_id);
  };

  const handleProjectDelete = (project_id, project_name) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Do you want to delete project " + project_name +" ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((value) => {
      value.isConfirmed &&
        axios
          .get(`${ge_api_url}/ge/delete_project/?project_id=` +project_id)
          .then((res) => {
            loadProjectDetails();
            Swal.fire({
              icon: "success",
              title: "Delete Success",
              text: "Project " + project_name + " deleted !",
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Error in Deletion",
              text: "Failed to delete project : " + project_name,
            });
          });
    });
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
          <b>Projects</b>
        </h4>

        <div className="m-3">
          <Button
            size="sm"
            onClick={handleShow}
            style={{ backgroundColor: "orangered", borderColor: "orangered" }}
          >
            Add Project
          </Button>
        </div>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <div className="m-3" style={{ width: "fit-width" }}>
          {projectDetails.length > 0 ? (
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {projectDetails.map((projectMap, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{projectMap.project_name}</td>
                    <td>{projectMap.isactive ==="1"? "Yes" : "No"}</td>
                    <td>
                    <Button
                        size="sm"
                        variant="secondary"

                        onClick={() =>
                          handleProjectEdit(projectMap.project_id)
                        }
                      >
                        Edit
                      </Button>
                      </td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleProjectDelete(projectMap.project_id, projectMap.project_name)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span>You have not created any project yet !</span>
          )}
        </div>
        <div>
          <CreateProject
            show={openModal}
            onHide={handleClose}
            loadProjectList={loadProjectList}
          />
        </div>
      </div>
    </div>
  );
}

export default Projects;
