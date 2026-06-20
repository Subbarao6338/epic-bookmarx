import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
// import expectation_list from "../ExpectationSuite/expectation_list";
import expectation_list from "../ExpectationSuite/expectation_list";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function CreateSuite() {
  const [suiteList, setSuiteList] = useState([]);
  const [suite, setSuite] = useState(null);
  const [expectationList, setExpectationList] = useState(expectation_list);
  const [filteredExpectations, setfilteredExpectations] = useState(
    expectationList.filter(({ dq_dimension }) => dq_dimension === "accuracy")
  );

  const [currentSelected, setCurrentSelected] = useState({});
  const [expectations, setExpectations] = useState([]);
  const [ruleType, setRuleType] = useState("accuracy");
  const [selectedCEs, setSelectedCEs] = useState(["Loading..."]);
  const [costValue, setCostValue] = useState(0);
  const [mostlyValue, setMostlyValue] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [nextDisable, setNextDisable] = useState(true);
  const [countAdd, setCountAdd] = useState(0);

  const handleSuiteInit = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(...formData);
    axios
      .post(`${ge_api_url}/ge/update_expectation_suite/`, formData)
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.data.duplicate) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              "Ruleset " +
              formData.get("expectation_suite_name") +
              " already exists !",
          });
        } else {
          setSuite({
            expectation_suite_name: formData.get("expectation_suite_name"),
            columns: formData.get("columns").split(","),
            creation_method: formData.get("creation_method"),
          });
          document.getElementById("exp_back").style.display = "none";
          document.getElementById("first_next_button").style.display = "none";
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const removeExpectation = (expectation) => {
    let temp_for_count = expectations.filter(({ column, expectation_type }) => {
      return (
        column + expectation_type ===
        expectation.column + expectation.expectation_type
      );
    });
    setExpectations([
      ...expectations.filter(({ column, expectation_type }) => {
        return (
          column + expectation_type !==
          expectation.column + expectation.expectation_type
        );
      }),
    ]);
    let count_add = countAdd - temp_for_count.length;
    setCountAdd(count_add);
    if (count_add > 0) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  };

  const handleColumnSelect = (e) => {
    const new_view = expectationList.find(
      ({ expectation_type }) =>
        expectation_type === currentSelected.expectation_type
    );
    new_view.kwargs.column = e.target.value;
    new_view.kwargs.cost = 0;
    new_view.kwargs.mostly = 0.8;
    setCostValue(0);
    document.getElementById("mostly_select").value = "80";
    setMostlyValue(0.8);
    setCurrentSelected({
      ...currentSelected,
      column: e.target.value,
      expectation: JSON.stringify(new_view, null, 2),
    });
  };

  const handleRuleTypeSelect = (e) => {
    const selected_rule_type = e.target.value;
    const filteredExpectations = expectationList.filter(
      ({ dq_dimension }) => dq_dimension === selected_rule_type
    );
    setRuleType(selected_rule_type);
    setfilteredExpectations(filteredExpectations);
    handleColumnSelect({
      target: { value: selectedCEs[0] },
    });
    handleExpectationTypeSelect({
      target: { value: filteredExpectations[0].expectation_type },
    });
  };

  const handleExpectationTypeSelect = (e) => {
    const new_view = expectationList.find(
      ({ expectation_type }) => expectation_type === e.target.value
    );
    new_view.kwargs.column = currentSelected.column;
    new_view.kwargs.cost = 0;
    new_view.kwargs.mostly = 0.8;
    setCostValue(0);
    document.getElementById("mostly_select").value = "80";
    setMostlyValue(0.8);
    setCurrentSelected({
      ...currentSelected,
      expectation_type: e.target.value,
      expectation: JSON.stringify(new_view, null, 2),
    });
  };

  const handleCostChange = (e) => {
    const new_view = expectationList.find(
      ({ expectation_type }) =>
        expectation_type === currentSelected.expectation_type
    );
    const cost_val = e.target.value;
    new_view.kwargs.cost = cost_val;
    setCostValue(cost_val);
    setCurrentSelected({
      ...currentSelected,
      expectation: JSON.stringify(new_view, null, 2),
    });
  };

  const handleMostlySelect = (e) => {
    const new_view = expectationList.find(
      ({ expectation_type }) =>
        expectation_type === currentSelected.expectation_type
    );
    const mostly_val = e.target.value / 100;
    new_view.kwargs.mostly = mostly_val;
    setMostlyValue(mostly_val);
    setCurrentSelected({
      ...currentSelected,
      expectation: JSON.stringify(new_view, null, 2),
    });
  };

  const handleJsonChange = (e) => {
    setCurrentSelected({ ...currentSelected, expectation: e.target.value });
  };

  const handleExpectationAppend = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // console.log(...formData);
    const newExpectation = {
      ...JSON.parse(formData.get("kwargs")),
      column: formData.get("column"),
    };
    console.log(newExpectation);
    setExpectations([...expectations, newExpectation]);
    setNextDisable(false);
    setCountAdd(countAdd + 1);
  };

  const handleSuiteSave = () => {
    setLoading(true);
    const formData = new FormData();
    const expectation_suite = {
      expectation_suite_name: suite.expectation_suite_name,
      expectations: expectations.map(({ expectation_type, kwargs }) => ({
        expectation_type,
        kwargs,
      })),
    };
    formData.append("suite_config", JSON.stringify(expectation_suite));
    axios
      .post(`${ge_api_url}/ge/create_expectation_suite/`, formData)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          document.getElementById("next").click();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  const handleBack = (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      current_page: "CDEs",
      status: "in-progress",
    };
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    axios
      .post(`${ge_api_url}/ge/update_status_to_wizard/`, formData)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          document.getElementById("back").click();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const loadSelectedCEs = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/get_wizard_detail/`)
      .then((res) => {
        console.log(res);
        const temp = JSON.parse(res.data.detail.selected_ce).list;
        setSelectedCEs(temp);
        document.getElementById("selected_columns").style.color = "black";
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Internal server error !",
          text: err,
        });
      });
  };

  useEffect(() => {
    loadSelectedCEs();
  }, []);

  useEffect(() => {
    const new_view = filteredExpectations[0];
    new_view.kwargs.column = suite && suite.columns[0];
    setCurrentSelected({
      ...currentSelected,
      column: suite && suite.columns[0],
      expectation_type: filteredExpectations[0].expectation_type,
      expectation: JSON.stringify(new_view, null, 2),
    });
  }, [suite]);

  return (
    <div style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}>
      <div className="mb-3">
        <h5 className="fw-bold">Apply Rules</h5>
      </div>
      <form id="form_apply_rule" onSubmit={handleSuiteInit}>
        <div className="row mb-3">
          <div className="col-3 p-1 ms-3">
            <label className="form-label">Expectation Suite Name :</label>
          </div>
          <div className="col-8">
            <input
              name="expectation_suite_name"
              className="form-control col-4"
              type="text"
              id="expectation_suite_name"
              placeholder="Enter Suite name "
              style={{ color: "black" }}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3 p-1 ms-3">
            <label className="form-label">Select Creation Method :</label>
          </div>
          <div className="col-8">
            <select name="creation_method" className="form-select">
              <option>Manually</option>
              {/* <option>Interactively (requires sample data)</option>
              <option>AutoProfiler (requires sample data)</option> */}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3 p-1 ms-3">
            <label className="form-label">Column Names :</label>
          </div>
          <div className="col-8">
            <textarea
              type="text"
              name="columns"
              id="selected_columns"
              className="form-control text-break"
              placeholder="Enter comma(,) separated column names"
              value={selectedCEs}
              style={{ color: "gray" }}
              required
            />
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-5 text-start">
            <Button
              className="btn btn-danger"
              onClick={handleBack}
              id="exp_back"
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
            >
              Back
            </Button>
          </div>
          <div className="col-7 text-end">
            <button
              className="btn btn-primary"
              id="first_next_button"
              type="sumbit"
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
            >
              Next
            </button>
          </div>
        </div>
        <br />
      </form>
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      {suite ? (
        <div className="m-2">
          <form onSubmit={handleExpectationAppend}>
            <div className="row p-1 border">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label">Select Dimension</label>
                  <select
                    name="rule_type"
                    className="form-select"
                    onChange={handleRuleTypeSelect}
                  >
                    {/* <option value="table">Table</option>
                    <option value="column">Column</option>
                    <option value="aggregate">Aggregate</option> */}
                    <option value="accuracy">Accuracy</option>
                    <option value="integrity">Integrity</option>
                    <option value="completeness">Completeness</option>
                    <option value="uniqueness">Uniqueness</option>
                    <option value="precision">Precision</option>
                    <option value="validity">Validity</option>
                    <option value="consistency">Consistency</option>
                    <option value="accessibility">Accessibility</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Expectation</label>
                  <select
                    name="expectation_type"
                    className="form-select"
                    onChange={handleExpectationTypeSelect}
                  >
                    {filteredExpectations.map(
                      ({ expectation_type, kwargs }) => (
                        <option key={expectation_type} value={expectation_type}>
                          {expectation_type}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Column</label>
                  <select
                    name="column"
                    className="form-select"
                    onChange={handleColumnSelect}
                  >
                    {suite.columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost of Quality ($)</label>
                  <input
                    name="cost_associated"
                    className="form-control col-4"
                    type="number"
                    placeholder="Enter Cost"
                    value={costValue}
                    onChange={handleCostChange}
                    required
                  />
                  <label style={{ fontSize: "13px" }}>
                    Cost associcated with 1% of failure
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label className="form-label">Threshold</label>
                  {/* <input name="mostly" className="form-control"></input> */}
                  <select
                    id="mostly_select"
                    className="form-select"
                    onChange={handleMostlySelect}
                  >
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80" selected>
                      80%
                    </option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
                <div className="">
                  <label className="form-label">Parameters</label>
                  <textarea
                    name="kwargs"
                    className="form-control"
                    value={currentSelected.expectation}
                    onChange={handleJsonChange}
                    spellCheck={false}
                    rows={9}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end pt-3">
              <Button
                type="submit"
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
              >
                Add
              </Button>
            </div>
          </form>
          <br />
          <div>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Column Name</th>
                  <th>Expectation Name</th>
                  <th>Parameter</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expectations.map((expectation) => (
                  <tr key={expectation.column + expectation.expectation_type}>
                    <td>{expectation.column}</td>
                    <td>{expectation.expectation_type}</td>
                    <td>
                      {JSON.stringify(expectation.kwargs).slice(0, 20) + "...}"}
                    </td>
                    <td>
                      {/* <Button
                        className="me-2"
                        size="sm"
                        style={{
                          backgroundColor: 'orangered',
                          borderColor: 'orangered',
                        }}
                      >
                        Edit
                      </Button> */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          removeExpectation(expectation);
                        }}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-7 text-start pt-3">
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
            <div className="col-5 text-end pt-3">
              <Button
                onClick={handleSuiteSave}
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
                disabled={nextDisable}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center"></div>
      )}
    </div>
  );
}

export default CreateSuite;
