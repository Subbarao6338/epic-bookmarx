import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreateModal from "./createCheckpoint";
import { ge_api_url } from "../../config/api";
import ViewModal from "./viewDatasetInfo";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function Checkpoint() {
  const [openModal, setOpenModal] = useState();
  const [checkpointDetails, setCheckpointDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleShow = () => {
    setOpenModal(true);
  };

  const loadCheckpointDetail = (checkpoint_details = []) => {
    let list_checkpoints_details = new Array();
    checkpoint_details.map((item) => {
      // console.log(item);
      const detail_json = {
        checkpoint_name: item.name,
        suite_name: item.validations[0].expectation_suite_name,
        datasource_name: item.validations[0].batch_request.datasource_name,
        data_asset_name: item.validations[0].batch_request.data_asset_name,
      };
      // console.log(detail_json);
      list_checkpoints_details.push(detail_json);
    });
    console.log(list_checkpoints_details);
    setCheckpointDetails(list_checkpoints_details);
    setLoading(false);
  };

  const loadCheckpoints = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/list_checkpoints/`)
      .then((res) => {
        console.log(res.data);
        loadCheckpointDetail(res.data.checkpoint_detail);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRunCheckpoint = (checkpoint_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to run the checkpoint : " + checkpoint_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Run it!",
    }).then((value) => {
      if (value.isConfirmed) {
        setLoading(true);
        axios
          .post(`${ge_api_url}/ge/run_checkpoint/${checkpoint_name}/`)
          .then((res) => {
            console.log(res);
            let succ_per = Math.round(
              res.data.result.statistics.success_percent
            );
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Validation done !",
              text: "Success score: " + succ_per + " %",
              footer: `<a href="/validations">
                  navigate to validation page
                </a>`,
            });
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Validation failed !",
              text: "Please try again !",
            });
          });
      }
    });
  };

  const handleCheckpointDelete = (checkpoint_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to delete the checkpoint : " + checkpoint_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then((value) => {
      value.isConfirmed &&
        axios
          .get(`${ge_api_url}/ge/delete_checkpoint/${checkpoint_name}/`)
          .then((res) => {
            console.log(res);
            loadCheckpointDetail(res.data.checkpoint_detail);
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully...",
              text: "Checkpoint " + checkpoint_name + " deleted !",
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete checkpoint : " + checkpoint_name,
            });
          });
    });
  };

  useEffect(() => {
    loadCheckpoints();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        <h4 className="text-center border p-1">
          <b>CHECKPOINTS</b>
        </h4>

        <div className="m-3">
          <Button
            size="sm"
            onClick={handleShow}
            style={{ backgroundColor: "orangered", borderColor: "orangered" }}
          >
            Add Checkpoint
          </Button>
        </div>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <div className="m-3" style={{ width: "fit-width" }}>
          {checkpointDetails.length > 0 ? (
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Checkpoint Name</th>
                  <th>Suite Name</th>
                  <th>Datasource Name</th>
                  <th>Dataset Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {checkpointDetails.map((checkpoint, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{checkpoint.checkpoint_name}</td>
                    <td>{checkpoint.suite_name}</td>
                    <td>{checkpoint.datasource_name}</td>
                    <td>{checkpoint.data_asset_name}</td>
                    <td>
                      <Button
                        className="primary me-2"
                        size="sm"
                        onClick={() =>
                          handleRunCheckpoint(checkpoint.checkpoint_name)
                        }
                      >
                        Run
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleCheckpointDelete(checkpoint.checkpoint_name)
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
            <span>You have not created any Checkpoint yet !</span>
          )}
        </div>
        <div>
          <CreateModal
            show={openModal}
            onHide={handleClose}
            loadCheckpointDetail={loadCheckpointDetail}
          />
        </div>
      </div>
    </div>
  );
}

export default Checkpoint;
