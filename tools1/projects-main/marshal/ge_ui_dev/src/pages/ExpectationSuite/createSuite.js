import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
// import expectation_list from "../ExpectationSuite/expectation_list";
import expectation_list from "../ExpectationSuite/expectation_list";
import { ge_api_url } from "../../config/api";
import Swal from "sweetalert2";

function CreateSuite() {
  const [suite, setSuite] = useState(null);
  const [expectationList, setExpectationList] = useState(expectation_list);
  const [filteredExpectations, setfilteredExpectations] = useState(
    expectationList.filter(({ dq_dimension }) => dq_dimension === "accuracy")
  );

  const [currentSelected, setCurrentSelected] = useState({});
  const [expectations, setExpectations] = useState([]);
  const [ruleType, setRuleType] = useState("accuracy");
  const [selectedCEs, setSelectedCEs] = useState([]);
  const [costValue, setCostValue] = useState(0);
  const [mostlyValue, setMostlyValue] = useState(0.8);

  const getExpectationList = () => {
    axios
      .get(`${ge_api_url}/ge/get_expectation_list/`)
      .then((res) => {
        console.log(res);
        // setExpectationType(res.data.list);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSuiteInit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(...formData);
    setSuite({
      expectation_suite_name: formData.get("expectation_suite_name"),
      columns: formData.get("columns").split(","),
      creation_method: formData.get("creation_method"),
    });
  };

  const removeExpectation = (expectation) => {
    setExpectations([
      ...expectations.filter(({ column, expectation_type }) => {
        return (
          column + expectation_type !==
          expectation.column + expectation.expectation_type
        );
      }),
    ]);
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
  };

  const handleSuiteSave = () => {
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
        Swal.fire({
          icon: "success",
          title: "Created Successfully...",
          text:
            "Rulesest " +
            expectation_suite.expectation_suite_name +
            " created !",
        });
        window.location = "/expectation_suite";
      })

      .catch((err) => {
        console.error(err);
      });
    document.getElementById("next").click();
  };

  useEffect(() => {
    getExpectationList();
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
      <form onSubmit={handleSuiteInit}>
        <div className="row mb-3">
          <div className="col-3 p-1 ms-3">
            <label className="form-label">Expectation Suite Name :</label>
          </div>
          <div className="col-4">
            <input
              name="expectation_suite_name"
              className="form-control col-4"
              type="text"
              placeholder="Enter Suite name "
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3 p-1 ms-3">
            <label className="form-label">Select Creation Method :</label>
          </div>
          <div className="col-4">
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
          <div className="col-4">
            <textarea
              type="text"
              name="columns"
              className="form-control text-break"
              placeholder="Enter comma(,) separated column names"
              required
            />
          </div>
          <div className="row pt-2">
            <div className="col-5 text-start"></div>
            <div className="col-7 text-end">
              <button
                className="btn btn-primary"
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
        </div>
      </form>

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
                  <label className="form-label">Cost</label>
                  <input
                    name="cost_associated"
                    className="form-control col-4"
                    type="text"
                    placeholder="Enter Cost"
                    value={costValue}
                    onChange={handleCostChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div>
                  <label className="form-label">Threshold</label>
                  {/* <input name="mostly" className="form-control"></input> */}
                  <select
                    id="mostly_select"
                    className="form-select"
                    onChange={handleMostlySelect}
                  >
                    <option value="20">20%</option>
                    <option value="40">40%</option>
                    <option value="60">60%</option>
                    <option value="80" selected>
                      80%
                    </option>
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
            <div className="col-7 text-start pt-3"></div>
            <div className="col-5 text-end pt-3">
              <Button
                onClick={handleSuiteSave}
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
              >
                Submit
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
