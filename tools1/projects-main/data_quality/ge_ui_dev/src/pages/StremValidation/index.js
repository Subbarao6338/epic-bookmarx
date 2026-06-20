import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ge_api_url } from "../../config/api";
import CreateCheckpoint from "./CreateCheckpoint";
import ViewDetailModal from "./ViewDetailModal";
import { Link } from "react-router-dom";

function StreamValidation() {
  const [streamCheckpoints, setStreamCheckpoints] = useState([]);
  const [openViewDetailModal, setOpenViewDetailModal] = useState({
    show: false,
    data: null,
  });

  const [openCreateCheckpoint, setOpenCreateCheckpoint] = useState({
    show: false,
    data: null,
  });

  const getStreamCheckpoints = () => {
    axios
      .get(ge_api_url + "/ge/list_stream_checkpoints/")
      .then((res) => {
        console.log(res.data);
        setStreamCheckpoints(res.data.checkpoints);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOpenViewDetail = (checkpoint_name) => {
    setOpenViewDetailModal({ show: true, data: { checkpoint_name } });
  };

  const handleStartStop = (checkpoint_name, status) => {
    const formData = new FormData();
    formData.append("checkpoint_name", checkpoint_name);
    if (status) {
      axios
        .post(ge_api_url + "/ge/start_stream_validation/", formData)
        .then((res) => {
          alert("validation started");
          console.log(res.data);
          getStreamCheckpoints();
        })
        .catch((err) => {
          alert("error", err);
          console.error(err);
        });
    } else {
      axios
        .post(ge_api_url + "/ge/stop_stream_validation/", formData)
        .then((res) => {
          alert("validation stopped");
          console.log(res.data);
          getStreamCheckpoints();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleCreateCheckpoint = () => {
    setOpenCreateCheckpoint({ show: true });
  };

  const handleDeleteCheckpoint = (checkpoint_name) => {
    const isConfirmed = window.confirm(
      "This will stop validation, then delete the checkpoint!!"
    );
    if (isConfirmed) {
      axios
        .post(ge_api_url + `/ge/delete_stream_checkpoint/${checkpoint_name}/`)
        .then((res) => {
          console.log(res.data);
          getStreamCheckpoints();
        })
        .catch((err) => {
          alert("error", err);
          console.error(err);
        });
    }
  };

  useEffect(() => {
    getStreamCheckpoints();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        {" "}
        <h4 className="border p-1 text-center">
          <b>STREAM DATA VALIDATION</b>
        </h4>
        <Button
          className="m-3"
          size="sm"
          onClick={handleCreateCheckpoint}
          style={{ backgroundColor: "orangered", borderColor: "orangered" }}
        >
          Add Checkpoint
        </Button>
        <CreateCheckpoint
          modal={openCreateCheckpoint}
          setModal={setOpenCreateCheckpoint}
          onClose={getStreamCheckpoints}
        />
        <ViewDetailModal
          modal={openViewDetailModal}
          setModal={setOpenViewDetailModal}
        />
        <div className="m-3">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Checkpoint Name</th>
                <th>Datasource Name</th>
                <th>Expectation Suite</th>
                <th>Status</th>
                <th>Monitor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {streamCheckpoints.map((value, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{value.checkpoint_name}</td>
                  <td>{value.datasource_name}</td>
                  <td>{value.expectation_suite_name}</td>
                  <td>
                    <span
                      className={`text-${value.status ? "success" : "danger"}`}
                    >
                      {value.status ? "Running" : "Stopped"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm btn-${
                        1 ? "success" : "warning"
                      } me-2`}
                      style={{ width: 100 }}
                      onClick={() =>
                        handleOpenViewDetail(value.checkpoint_name)
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm btn-${
                        value.status ? "secondary" : "primary"
                      } me-2`}
                      onClick={() =>
                        handleStartStop(value.checkpoint_name, !value.status)
                      }
                    >
                      {value.status ? "Stop" : "Start"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() =>
                        handleDeleteCheckpoint(value.checkpoint_name)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StreamValidation;
