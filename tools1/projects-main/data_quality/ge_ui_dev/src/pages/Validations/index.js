import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import RunValidation from "./RunValidation";
import ViewDetail from "./viewDetail";
import ViewCollapse from "./viewCollapse";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function Validations() {
  const [validations, setValidations] = useState([]);
  const [openViewDetail, setOpenViewDetail] = useState({
    data: {},
    show: false,
  });
  const [openViewCollapse, setOpenViewCollapse] = useState({
    data: {},
    show: false,
  });
  const [openNewValidation, setOpenNewValidation] = useState(false);
  const [successPercents, setSuccessPercents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accordionShown, setAccordionShown] = useState([]);
  const [drillDownData, setDrillDownData] = useState([
    {
      run_name: "",
      rule_list: [
        {
          rule_name: "",
          cdes: [
            {
              column: "",
              success: "",
            },
          ],
          pass_percent: "",
        },
      ],
    },
  ]);

  function resultPrepForDrillDown(validation_data) {
    // console.log(validation_data);
    let all_result_drill = new Array();
    let count_val = 0;
    validation_data.map((val) => {
      // console.log(val.value.results);
      const diff_rule_list = [
        ...new Set(
          val.value.results.map(
            (item) => item.expectation_config.expectation_type
          )
        ),
      ];
      let rule_wise_list = new Array();
      let counter_rule = 0;
      diff_rule_list.map((value, index) => {
        let new_data = val.value.results.filter(
          (item) => item.expectation_config.expectation_type === value
        );
        // console.log(new_data);
        let temp_arr_for_cde = new Array();
        let succ_count = 0;
        let counter_cde = 0;
        new_data.map((item) => {
          const col = item.expectation_config.kwargs.column;
          const succ = item.success;
          temp_arr_for_cde.push({
            column: col,
            success: succ,
          });
          if (succ) {
            succ_count += 1;
          }
          counter_cde += 1;
        });
        if (counter_cde === new_data.length) {
          let temp_detail = {
            rule_name: value,
            cdes: temp_arr_for_cde,
            pass_percent: Math.round(
              (succ_count / temp_arr_for_cde.length + Number.EPSILON) * 100
            ),
          };
          // console.log(temp_detail);
          rule_wise_list.push(temp_detail);
        }
        counter_rule += 1;
      });
      if (counter_rule === diff_rule_list.length) {
        let run_wise_detail = {
          run_name: val.run_name,
          rule_list: rule_wise_list,
        };
        // console.log(run_wise_detail);
        all_result_drill.push(run_wise_detail);
      }
      count_val += 1;
    });
    if (count_val === validation_data.length) {
      setDrillDownData(all_result_drill);
      console.log(all_result_drill);
      setLoading(false);
    }
  }

  const loadValidations = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/validations/`)
      .then((res) => {
        console.log(res.data);
        setValidations(res.data.validations);
        var arr = new Array();
        res.data.validations.map((value) =>
          arr.push(value.value.statistics.success_percent)
        );
        setSuccessPercents(arr);
        resultPrepForDrillDown(res.data.validations);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const deleteValidationResult = (suite_name, run_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to delete the validation : " + run_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((value) => {
      if (value.isConfirmed) {
        setLoading(true);
        axios
          .delete(`${ge_api_url}/ge/validation/${suite_name}/${run_name}/`)
          .then((res) => {
            console.log(res);
            loadValidations();
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully...",
              text: "Validation " + run_name + " deleted !",
            });
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete validation: " + run_name,
            });
          });
      }
    });
  };

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

  const showAccordion = (run_name) => {
    // alert(run_name);
    if (document.getElementById("plus-minus" + run_name).innerText === "+") {
      document.getElementById("plus-minus" + run_name).innerText = "-";
    } else {
      document.getElementById("plus-minus" + run_name).innerText = "+";
    }
    const shownState = accordionShown.slice();
    const index = shownState.indexOf(run_name);
    if (index >= 0) {
      shownState.splice(index, 1);
      setAccordionShown(shownState);
    } else {
      shownState.push(run_name);
      setAccordionShown(shownState);
    }
  };

  const showCDES = (run_name, element) => {
    if (
      document.getElementById("plus-minus" + run_name + element.rule_name)
        .innerText === "+"
    ) {
      document.getElementById(
        "plus-minus" + run_name + element.rule_name
      ).innerText = "-";
    } else {
      document.getElementById(
        "plus-minus" + run_name + element.rule_name
      ).innerText = "+";
    }
    element.cdes.map((cde) => {
      let given_id = run_name + element.rule_name + cde.column;
      if (document.getElementById(given_id).style.display === "none") {
        document.getElementById(given_id).style.display = "";
      } else {
        document.getElementById(given_id).style.display = "none";
      }
    });
  };

  const handleOpenNewValidation = () => setOpenNewValidation(true);

  useEffect(() => {
    loadValidations();
  }, []);

  return (
    <>
      <div
        className="p-3"
        style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
      >
        <div className="border">
          <div className="border p-1">
            <h4 className="text-center">
              <b>VALIDATIONS</b>
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
              onClick={handleOpenNewValidation}
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
            >
              Run Validation
            </Button>
            <RunValidation
              openNewValidation={openNewValidation}
              setOpenNewValidation={setOpenNewValidation}
              onRunComplete={loadValidations}
            />
          </div>

          {validations.length > 0 &&
          successPercents.length > 0 &&
          validations.length === successPercents.length ? (
            <div className="m-3">
              <ViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
              />
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>*</th>
                    <th>S.No</th>
                    <th>Run Name</th>
                    <th>Expectation Suite</th>
                    <th>Run Time</th>
                    <th>Result</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {validations.map((value, index) => (
                    <>
                      <tr
                        key={value.run_name}
                        onMouseEnter={() => {
                          document.body.style.cursor = "pointer";
                        }}
                        onMouseLeave={() => {
                          document.body.style.cursor = "default";
                        }}
                      >
                        <td onClick={() => showAccordion(value.run_name)}>
                          <b
                            style={{ fontSize: "20px" }}
                            id={"plus-minus" + value.run_name}
                          >
                            +
                          </b>
                        </td>
                        <td onClick={() => showAccordion(value.run_name)}>
                          {index + 1}
                        </td>
                        <td onClick={() => showAccordion(value.run_name)}>
                          {value.run_name}
                        </td>
                        <td onClick={() => showAccordion(value.run_name)}>
                          {value.expectation_suite_name}
                        </td>
                        <td onClick={() => showAccordion(value.run_name)}>
                          {value.run_time}
                        </td>
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
                            //   value.value.success ? "success" : "warning"
                            // }`}
                            onClick={() => showValidationCollapse(value)}
                          >
                            {Math.round(value.value.statistics.success_percent)}
                            % Pass
                          </Button>
                        </td>
                        <td>
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
                        </td>
                      </tr>
                      {accordionShown.includes(value.run_name) &&
                        drillDownData.length === validations.length &&
                        drillDownData[index].rule_list.map((element) => (
                          <>
                            <tr
                              style={{ backgroundColor: "#F4ECF7" }}
                              onClick={() => showCDES(value.run_name, element)}
                              onMouseEnter={() => {
                                document.body.style.cursor = "pointer";
                              }}
                              onMouseLeave={() => {
                                document.body.style.cursor = "default";
                              }}
                            >
                              <td colSpan={2}>{""}</td>
                              <td colSpan={3}>
                                <b
                                  style={{ fontSize: "20px" }}
                                  id={
                                    "plus-minus" +
                                    value.run_name +
                                    element.rule_name
                                  }
                                >
                                  +
                                </b>
                                &emsp;
                                {element.rule_name}
                              </td>
                              <td colSpan={2}>
                                <Button
                                  style={{
                                    width: 100,
                                    height: 32,
                                    background: `linear-gradient(to right, SeaGreen 0%, SeaGreen ${element.pass_percent}%, 
                            #bb2124  ${element.pass_percent}% , #bb2124  100%)`,
                                    border: `black`,
                                  }}
                                  className={`btn btn-sm`}
                                  //   value.value.success ? "success" : "warning"
                                  // }`}
                                >
                                  {Math.round(element.pass_percent)}% Pass
                                </Button>
                              </td>
                            </tr>
                            {element.cdes.map((cde) => (
                              <tr
                                id={
                                  value.run_name +
                                  element.rule_name +
                                  cde.column
                                }
                                style={{
                                  display: "none",
                                  backgroundColor: cde.success
                                    ? "#EAFAF1 "
                                    : "#FDEDEC",
                                }}
                              >
                                <td colSpan={2}>{""}</td>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                  {cde.column}
                                </td>

                                <td
                                  colSpan={2}
                                  style={{
                                    color: cde.success ? "green" : "red",
                                    // textAlign: "center",
                                  }}
                                >
                                  <Button
                                    style={{
                                      width: 100,
                                      height: 32,
                                      background: cde.success
                                        ? "SeaGreen"
                                        : "#bb2124",
                                      border: `black`,
                                    }}
                                    className={`btn btn-sm`}
                                    //   value.value.success ? "success" : "warning"
                                    // }`}
                                  >
                                    {cde.success ? "100% Pass" : "0% Pass"}
                                  </Button>
                                </td>
                                {/* <td>{""}</td>
                                <td>{""}</td> */}
                              </tr>
                            ))}
                          </>
                        ))}
                    </>
                  ))}
                  <ViewCollapse
                    openViewCollapse={openViewCollapse}
                    setOpenViewCollapse={setOpenViewCollapse}
                  />
                </tbody>
              </table>
              {/* <ViewAccordian /> */}
            </div>
          ) : (
            <span className="m-3">No valiadtion done yet!</span>
          )}
        </div>
      </div>
    </>
  );
}

export default Validations;
