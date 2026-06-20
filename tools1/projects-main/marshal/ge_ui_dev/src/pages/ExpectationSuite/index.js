import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { Link, Route, Routes } from "react-router-dom";
import CreateSuite from "./createSuite";
import ViewSuiteDetail from "./ViewSuiteDetail";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function ExpectationSuite() {
  return (
    <Routes>
      <Route index element={<ExpectationSuiteDefault />} />
      <Route path="/new" element={<CreateSuite />} />
    </Routes>
  );
}

export default ExpectationSuite;

function ExpectationSuiteDefault() {
  const [suiteList, setSuiteList] = useState([]);
  const [openViewDetail, setOpenViewDetail] = useState({ show: false });
  const [loading, setLoading] = useState(false);

  const loadExpectationSuites = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/list_expectation_suites/`)
      .then((res) => {
        console.log(res);
        setSuiteList(res.data.suite_list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSuiteDelete = (suite_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Want to delete the ruleset : " + suite_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((value) => {
      value.isConfirmed &&
        axios
          .delete(`${ge_api_url}/ge/delete_expectation_suite/${suite_name}/`)
          .then((res) => {
            console.log(res);
            setSuiteList(res.data.suite_list);
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully...",
              text: "Rulesest " + suite_name + " deleted !",
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete ruleset: " + suite_name,
            });
          });
    });
  };

  const handleViewDetail = (suite) => {
    // console.log(suite);
    setOpenViewDetail({
      show: true,
      suite_name: suite.expectation_suite_name,
      suite_detail: JSON.parse(suite.value),
    });
  };

  useEffect(() => {
    loadExpectationSuites();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        <h4 className="text-center border p-1">
          <b>EXPECTATION SUITE</b>
        </h4>

        {/* <div className="m-3">
          <Link
            className="btn btn-sm"
            style={{
              backgroundColor: "orangered",
              borderColor: "orangered",
              color: "white",
            }}
            to="/expectation_suite/new"
          >
            Create Expectation Suite
          </Link>
        </div> */}
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <div className="m-3">
          <ViewSuiteDetail
            openViewDetail={openViewDetail}
            setOpenViewDetail={setOpenViewDetail}
          />
          {suiteList.length > 0 ? (
            <table
              className="table table-hover table-bordered"
              style={{ maxWidth: 500 }}
            >
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Suite Name</th>
                  <th style={{ width: 200 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {suiteList.map((suite, index) => (
                  <tr key={suite.expectation_suite_name}>
                    <td>{index + 1}</td>
                    <td>{suite.expectation_suite_name}</td>
                    <td>
                      <Button
                        className="me-2"
                        size="sm"
                        onClick={() => handleViewDetail(suite)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleSuiteDelete(suite.expectation_suite_name)
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
            <span>No Expectation suite created yet !</span>
          )}
        </div>
      </div>
    </div>
  );
}
