import React, { Fragment, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import ViewDetail from "../Validations/viewDetail";
import ViewCollapse from "../Validations/viewCollapse";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function RunValidation({
  openNewValidation,
  setOpenNewValidation,
  onRunComplete,
}) {
  const [wizardData, setWizardData] = useState({
    datasource_name: "Loading Datasource...",
    selected_data_asset: "Loading Data Asset...",
    suite_name: "Loading Suite...",
  });
  const [runLoading, setRunLoading] = useState(false);
  const [validations, setValidations] = useState([]);
  const [openViewDetail, setOpenViewDetail] = useState({
    data: {},
    show: false,
  });
  const [openViewCollapse, setOpenViewCollapse] = useState({
    data: {},
    show: false,
  });
  const [validationReport, setValidationReport] = useState(null);
  const [successPercents, setSuccessPercents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(true);

  const loadWizardData = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/get_wizard_detail/`)
      .then((res) => {
        console.log(res);
        const datasource_name = res.data.detail.datasource_name;
        const selected_data_asset = res.data.detail.asset_for_profile;
        const suite_name = res.data.detail.expectation_suite_name;
        var temp = {
          datasource_name: datasource_name,
          selected_data_asset: selected_data_asset,
          suite_name: suite_name,
        };
        console.log(temp);
        setWizardData(temp);
        document.getElementById("ds_name").style.color = "black";
        document.getElementById("suite_name").style.color = "black";
        document.getElementById("run_asset").style.color = "black";
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        // alert("Error!");
        Swal.fire({
          icon: "error",
          title: "Internal server error !",
          text: err,
        });
      });
  };

  const handleRunValidation = (e) => {
    e.preventDefault();
    // loading button
    setRunLoading(true);
    setLoading(true);
    var formData = new FormData(e.target);

    // const expectation_suite_name = formData.get("suite_name");
    const expectation_suite_name = wizardData.suite_name;
    const batch_request = {
      // datasource_name: formData.get("datasource_name"),
      datasource_name: wizardData.datasource_name,
      data_connector_name: "default_inferred_data_connector_name",
      data_asset_name: wizardData.selected_data_asset,
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
        setValidationReport(res.data.report);
        loadValidations();
      })
      .catch((err) => {
        console.log(err);
        handleClose();
      });
  };

  const handleClose = () => {
    setRunLoading(false);
    setLoading(false);
    setSubmitDisable(false);
  };

  const loadValidations = () => {
    axios
      .get(`${ge_api_url}/ge/validations/`)
      .then((res) => {
        console.log(res.data);
        setValidations(res.data.validations);
        var arr = new Array();
        res.data.validations.map((value) =>
          arr.push(value.value.statistics.success_percent)
        );
        setSuccessPercents(arr.slice(-1));
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        handleClose();
      });
  };
  const handleBack = (e) => {
    e.preventDefault();
    document.getElementById("back").click();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Quality Checked Successfully...",
      footer: `<a href='/dashboard'>Navigate to Dashboard</a>`,
    });
    // alert("Quality Checked Successfully!!");
    // window.location = "/dashboard";
  };
  // const deleteValidationResult = (suite_name, run_name) => {
  //   axios
  //     .delete(`${ge_api_url}/ge/validation/${suite_name}/${run_name}/`)
  //     .then((res) => {
  //       console.log(res.data);
  //       // setValidations(res.data.validations);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  const showValidationDetail = (validation) => {
    setOpenViewDetail({
      show: true,
      data: JSON.stringify(validation.value, undefined, 2),
    });
  };

  const showValidationCollapse = (validation) => {
    setOpenViewCollapse({
      show: true,
      data: validation.value,
      runName: validation.run_name,
      expectationSuiteName: validation.expectation_suite_name,
    });
  };

  useEffect(() => {
    // loadValidations();
    loadWizardData();
  }, []);

  return (
    <div>
      <h5 className="mb-2 p-1 fw-bold">Validations</h5>
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <form onSubmit={handleRunValidation} spellCheck={false}>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Validation Run Name</label>
          </div>
          <div className="col-4">
            <input
              className="form-control"
              placeholder="Enter validation run_name"
              name="checkpoint_name"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Expectation Suite</label>
          </div>
          <div className="col-4">
            <input
              id="suite_name"
              style={{ color: "gray" }}
              className="form-control"
              value={wizardData.suite_name}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Datasource Name</label>
          </div>
          <div className="col-4">
            <input
              id="ds_name"
              style={{ color: "gray" }}
              className="form-control"
              value={wizardData.datasource_name}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Data Asset Name</label>
          </div>
          <div className="col-4">
            <input
              id="run_asset"
              style={{ color: "gray" }}
              className="form-control"
              value={wizardData.selected_data_asset}
              required
            />
          </div>

          <div className=" col-5 text-end mb-3">
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
          </div>
        </div>
      </form>

      <div>
        <div className="p-2">
          <ViewDetail
            openViewDetail={openViewDetail}
            setOpenViewDetail={setOpenViewDetail}
          />
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>*</th>
                <th>ExpectationSuite</th>
                <th>Run Name</th>
                <th>Run Time</th>
                <th>Result</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {validations.slice(-1).map((value, index) => (
                <tr key={value.run_name}>
                  <td>{index + 1}</td>
                  <td>{value.expectation_suite_name}</td>
                  <td>{value.run_name}</td>
                  <td>{value.run_time}</td>
                  <td>
                    <Button
                      style={{
                        width: 100,
                        height: 32,
                        background: `linear-gradient(to right, SeaGreen 0%, SeaGreen ${successPercents[index]}%, 
                            #bb2124  ${successPercents[index]}% , #bb2124  100%)`,
                        border: `black`,
                      }}
                      className={`btn btn-sm`}
                      onClick={() => showValidationCollapse(value)}
                    >
                      {Math.round(value.value.statistics.success_percent)}% Pass
                    </Button>
                  </td>
                  {/* <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        deleteValidationResult(
                          value.expectation_suite_name,
                          value.run_name
                        )
                      }
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
            <ViewCollapse
              openViewCollapse={openViewCollapse}
              setOpenViewCollapse={setOpenViewCollapse}
            />
          </table>
        </div>
        <div className="row">
          <div className="col-7 text-start pt-1">
            <Button
              className="btn btn-danger"
              onClick={handleBack}
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
            >
              Back
            </Button>
          </div>
          <div className="col-5 text-end pt-1">
            <Button
              className="btn btn-danger"
              onClick={handleSubmit}
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
              disabled={submitDisable}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RunValidation;
