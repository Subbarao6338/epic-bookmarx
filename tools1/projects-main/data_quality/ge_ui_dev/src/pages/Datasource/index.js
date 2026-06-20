import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
// import ViewDetail from "./viewDetail";
import CreateDatasource from "./CreateDatasource";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function Datasource() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [datasourceList, setDatasourceList] = useState([]);
  const [openViewDetail, setOpenViewDetail] = useState({
    show: false,
    data: null,
  });
  const [loading, setLoading] = useState(false);

  const loadDatasourceList = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/list_datasources/`)
      .then((res) => {
        console.log(res);
        // let datasource_info_array = new Array();
        setDatasourceList(res.data.datasources);
        // setDatasourceInfo(res.data.details);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenModal = () => {
    setOpenCreateModal(true);
  };

  const handleViewDetail = (data) => {
    data = JSON.stringify(data, undefined, 2);
    setOpenViewDetail({ ...{ show: true, data: data } });
    console.log(data);
  };

  const handleDeleteDatasource = (datasource_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to delete the datasource : " + datasource_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((value) => {
      value.isConfirmed &&
        axios
          .delete(`${ge_api_url}/ge/delete_datasource/` + datasource_name)
          .then((res) => {
            console.log(res);
            setDatasourceList(res.data.datasources);
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully...",
              text: "Datasource " + datasource_name + " deleted !",
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete datasource : " + datasource_name,
            });
          });
    });
  };

  useEffect(() => {
    loadDatasourceList();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        <div className="border p-1">
          <h4 className="text-center">
            <b>DATASOURCE</b>
          </h4>
        </div>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <div className="m-3">
          <Button
            size="sm"
            onClick={handleOpenModal}
            style={{ backgroundColor: "orangered", borderColor: "orangered" }}
          >
            Add Datasource
          </Button>
          <CreateDatasource
            openCreateModal={openCreateModal}
            setOpenCreateModal={setOpenCreateModal}
            onDatasourceCreated={setDatasourceList}
          />
        </div>
        <div className="m-3" style={{ width: 600 }}>
          {/* <ViewDetail
            openViewDetail={openViewDetail}
            setOpenViewDetail={setOpenViewDetail}
          /> */}
          {datasourceList.length > 0 ? (
            <table
              className="table table-hover table-bordered"
              // style={{ maxWidth: 500 }}
            >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Datasource Name</th>
                  <th>Datasource Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {datasourceList.map((datasource, index) => (
                  <tr key={datasource.datasource_name}>
                    <td>{index + 1}</td>
                    <td>{datasource.datasource_name}</td>
                    <td>
                      {datasource.type === "local_file"
                        ? "Local File"
                        : datasource.type.charAt(0).toUpperCase() +
                          datasource.type.slice(1)}
                    </td>
                    <td>
                      {/* <Button
                        className="me-2"
                        size="sm"
                        onClick={() => {
                          handleViewDetail(datasource);
                        }}
                      >
                        View
                      </Button> */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          handleDeleteDatasource(datasource.datasource_name);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span>No Datasource registered yet</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Datasource;
