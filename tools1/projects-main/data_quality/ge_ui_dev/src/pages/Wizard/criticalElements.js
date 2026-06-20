import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function CriticalElements() {
  const [elements, setElements] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [isAllSelectChecked, setIsAllSelectChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextdisable, setNextDisable] = useState(true);

  const handlesetElements = () => {
    // will get this data from db
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/get_wizard_detail/`)
      .then((res) => {
        console.log(res);
        const temp = JSON.parse(res.data.detail.all_columns).list;
        console.log(temp);
        setElements(temp);
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
    // setElements([
    //   { column: "Column1", dtype: "str" },
    //   { column: "Column2", dtype: "str" },
    //   { column: "Column3", dtype: "str" },
    //   { column: "Column4", dtype: "str" },
    // ]);
    setCheckedState(new Array(elements.length).fill(false));
  };

  const handleChange = (position) => {
    const updatedCheckedState = new Array(elements.length).fill(false);
    checkedState.map((item, index) => {
      if (index === position) {
        updatedCheckedState[index] = !item;
      } else {
        updatedCheckedState[index] = item;
      }
    });
    setCheckedState(updatedCheckedState);
    setIsAllSelectChecked(false);
    forNextButton(updatedCheckedState);
  };

  const forNextButton = (checked_arr) => {
    if (checked_arr.includes(true)) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  };

  const handleSelectAll = (e) => {
    let select_all = e.target.checked;
    if (select_all) {
      setCheckedState(Array(elements.length).fill(true));
      setIsAllSelectChecked(true);
      setNextDisable(false);
    } else {
      setCheckedState(Array(elements.length).fill(false));
      setIsAllSelectChecked(false);
      setNextDisable(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(checkedState);
    var updatedSelectedElements = new Array();
    checkedState.map((item, index) => {
      if (item === true) {
        var col = elements[index].column;
        updatedSelectedElements.push(col);
      }
    });
    var uniqueArray = [...new Set(updatedSelectedElements)];
    setSelectedElements(uniqueArray);
    console.log(uniqueArray);
    updateWizardData(uniqueArray);
  };

  const handleBack = (e) => {
    e.preventDefault();
    const body = {
      current_page: "profiling",
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

  const updateWizardData = (selected_ces) => {
    console.log(selected_ces);
    const json_converted = JSON.stringify({ list: selected_ces });
    const body = {
      selected_ces: json_converted,
      current_page: "expectation_suite",
    };
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    axios
      .post(`${ge_api_url}/ge/update_ces_to_wizard/`, formData)
      .then((res) => {
        console.log(res);
        // alert('Selected Successfully !!')
        setTimeout(() => {
          document.getElementById("next").click();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    handlesetElements();
  }, []);

  return (
    <div>
      <h5 className="p-1 fw-bold">Select Critical Elements</h5>
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <form className="p-2 ps-4" onSubmit={handleSubmit}>
        <div className="mb-2 dark border-bottom p-2 sm" style={{ width: 300 }}>
          <label name="select_all">
            <input
              type={"checkbox"}
              name="select_all"
              checked={isAllSelectChecked}
              onChange={handleSelectAll}
            />
            &emsp; <b>Select/Unselect All</b>
          </label>
        </div>
        {elements.map((value, index) => (
          <div className="mb-2 p-2 sm" style={{ width: 300 }}>
            <label name={value.column}>
              <input
                type={"checkbox"}
                name={value.column}
                checked={checkedState[index]}
                onChange={() => handleChange(index)}
              />
              &emsp;
              {value.column}
            </label>
          </div>
        ))}
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
              type="submit"
              style={{ backgroundColor: "orangered", borderColor: "orangered" }}
              disabled={nextdisable}
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CriticalElements;
