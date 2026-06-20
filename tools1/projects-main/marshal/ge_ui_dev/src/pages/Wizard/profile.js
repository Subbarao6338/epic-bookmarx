import React, { useEffect, useState } from "react";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import ProfileChart from "../DataProfiling/profileChart";
import DataLineChart from "../DataProfiling/dataLineChart";
import FrequencyChart from "../DataProfiling/frequencyChart";
import { default as ReactSelect } from "react-select";
import { Backdrop, CircularProgress } from "@mui/material";
// import FrequencyPercentageChart from './frequencyPercentageChart'
// import toDate from 'date-fns/toDate'
import Swal from "sweetalert2";

function RunProfiling() {
  const [datasourceName, setDatasourceName] = useState("Loading...");
  const [runLoading, setRunLoading] = useState(false);
  const [profileReport, setProfileReport] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [dataColumns, setDataColumns] = useState([]);
  const [assetForRun, setAssetForRun] = useState();
  const [rowPercentage, setRowPercentage] = useState(100);
  const [minPercentage, setMinPercentage] = useState(1);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSelectedDatasource = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/get_wizard_detail/`)
      .then((res) => {
        console.log(res);
        const ds_name = res.data.detail.datasource_name;
        const assets_ls = JSON.parse(res.data.detail.data_assets).list;
        setDatasourceName(ds_name);
        setSelectedAssets(assets_ls);
        setAssetForRun(assets_ls[0]);
        document.getElementById("datas_name").style.color = "black";
        const formdata = new FormData();
        formdata.append("datasource_name", ds_name);
        formdata.append("asset_name", assets_ls[0]);
        axios
          .post(`${ge_api_url}/ge/get_columns_of_asset/`, formdata)
          .then((res) => {
            console.log(res);
            const arr = new Array();
            const arr2 = new Array();
            arr.push({ value: "All Columns", label: "All Columns" });
            res.data.columns.map((item) => {
              var temp_json = {
                value: item,
                label: item,
              };
              var temp_json2 = {
                column: item,
                dtype: null,
              };
              arr.push(temp_json);
              arr2.push(temp_json2);
            });
            setAllColumns(arr);
            updateWizard(arr2, assets_ls[0]);
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
      })
      .catch((err) => {
        console.error(err);
        document.getElementById("warning").style.display = "";
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Internal server error !",
          text: err,
        });
      });
  };

  const handleAssetSelect = (selected) => {
    // console.log(selected);
    setLoading(true);
    setAssetForRun(selected);
    const formdata = new FormData();
    formdata.append("datasource_name", datasourceName);
    formdata.append("asset_name", selected);
    axios
      .post(`${ge_api_url}/ge/get_columns_of_asset/`, formdata)
      .then((res) => {
        console.log(res);
        const arr_temp = new Array();
        const arr_temp2 = new Array();
        arr_temp.push({ value: "All Columns", label: "All Columns" });
        res.data.columns.map((item) => {
          var temp_json = {
            value: item,
            label: item,
          };
          var temp_json_2 = {
            column: item,
            dtype: null,
          };
          arr_temp.push(temp_json);
          arr_temp2.push(temp_json_2);
        });
        setAllColumns(arr_temp);
        updateWizard(arr_temp2, selected);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSelectColumnsChange = (selected) => {
    var temp_arr = new Array();
    selected.map((item) => {
      temp_arr.push(item.value);
    });
    console.log(temp_arr);
    setSelectedColumns(temp_arr);
  };

  const handleRunProfiler = (e) => {
    e.preventDefault();
    // loading button
    setRunLoading(true);
    var formDataORG = new FormData(e.target);
    var asset_for_run = formDataORG.get("data_asset_name");
    setAssetForRun(asset_for_run);
    const body = {
      datasource_name: datasourceName,
      data_asset_name: asset_for_run,
      row_percentage: rowPercentage,
      columns: selectedColumns,
    };
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log(...formData);
    axios
      .post(`${ge_api_url}/ge/data_profiling/`, formData)
      .then((res) => {
        console.log(res);
        let response = res.data;
        setProfileReport(response.report);
        // eslint-disable-next-line no-array-constructor
        if (
          (selectedColumns.length === 0) |
          selectedColumns.includes("All Columns")
        ) {
          console.log(response.report);
          var cols = Object.keys(response.report.variables);
        } else {
          var cols = selectedColumns;
        }
        var col_with_dtypes = new Array();
        for (var val in cols) {
          var temp = {
            column: cols[val],
            dtype: response.report.variables[cols[val]]["type"],
          };
          col_with_dtypes.push(temp);
        }
        setDataColumns(col_with_dtypes);
        updateWizard(col_with_dtypes, asset_for_run);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Internal server error !",
          text: err,
        });
        setRunLoading(false);
      });
  };

  const updateWizard = (col_with_dtypes, asset_for_run) => {
    const json_converted = JSON.stringify({ list: col_with_dtypes });
    const body = {
      all_cols: json_converted,
      asset_for_profile: asset_for_run,
    };
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    axios
      .post(`${ge_api_url}/ge/update_column_and_asset/`, formData)
      .then((res) => {
        console.log(res.data);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
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
          document.getElementById("next").click();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      current_page: "datasource",
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

  const handleClose = () => {
    setRunLoading(false);
  };

  useEffect(() => {
    loadSelectedDatasource();
  }, []);

  return (
    <div>
      <h5 className="mb-2 fw-bold"> Basic Profiling </h5>
      <form onSubmit={handleRunProfiler} spellCheck={false}>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Datasource Name :</label>
          </div>

          <div className="col-6">
            <input
              id="datas_name"
              style={{ color: "grey" }}
              className="form-control"
              value={datasourceName}
              required
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Select Data Asset :</label>
          </div>
          <div className="col-6">
            <select
              className="form-select"
              name="data_asset_name"
              onChange={(e) => handleAssetSelect(e.target.value)}
            >
              {selectedAssets.map((asset_name) => (
                <option key={asset_name} value={asset_name}>
                  {asset_name}
                </option>
              ))}
            </select>
            <label
              id="warning"
              style={{ display: "none", color: "red", fontSize: "14px" }}
            >
              Error!
            </label>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Row Percentage :</label>
          </div>

          <div className="col-6">
            <input
              id="row_percentage"
              type="number"
              className="form-control"
              value={rowPercentage}
              onChange={(e) => setRowPercentage(e.target.value)}
              min={minPercentage}
              // min="1"
              max="100"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-3">
            <label className="form-label">Select Columns :</label>
          </div>

          <div className="col-6">
            <ReactSelect
              id="select_columns"
              isMulti
              options={allColumns}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              allowSelectAll={true}
              onChange={handleSelectColumnsChange}
              defaultValue={{ value: "All Columns", label: "All Columns" }}
            ></ReactSelect>
          </div>
          <div className=" col-3 text-end">
            <Button
              type="submit"
              id="run_profile_button"
              disabled={runLoading}
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
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
                "Run Profiler"
              )}
            </Button>
            {/* <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button> */}
          </div>
        </div>
      </form>
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      {profileReport ? (
        <div>
          <h5 className="mb-2 fw-bold"> Profile Report </h5>
          <div className="p-1">
            <div>
              <table
                className="table table-bordered table-sm"
                style={{ width: 450 }}
              >
                <thead className="border">
                  <tr>
                    <th colSpan="2"> Dataset Info</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width={150}>Datasource Name</td>
                    <td width={250}>{datasourceName}</td>
                  </tr>
                  <tr>
                    <td>Data Asset Name</td>
                    <td>{assetForRun}</td>
                  </tr>
                  <tr>
                    <td>Row Count</td>
                    <td>{profileReport.table.n}</td>
                  </tr>
                  <tr>
                    <td>Column Count</td>
                    <td>{profileReport.table.n_var}</td>
                  </tr>
                  <tr>
                    <td>Null Cells</td>
                    <td>{profileReport.table.n_cells_missing}</td>
                  </tr>
                  <tr>
                    <td>Not Null Cells</td>
                    <td>
                      {profileReport.table.n * profileReport.table.n_var -
                        profileReport.table.n_cells_missing}
                    </td>
                  </tr>
                  <tr>
                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={
                        <Tooltip>
                          Percentage of data type of column against all columns
                        </Tooltip>
                      }
                    >
                      <td>Frequency</td>
                    </OverlayTrigger>
                    <td>
                      {getFrequency(dataColumns).map((data) => (
                        <div>
                          {data.type} : {Math.round(100 * data.frequency) / 100}
                          %
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={
                        <Tooltip>
                          Ratio of the number of not null rows divided by the
                          total number of rows
                        </Tooltip>
                      }
                    >
                      <td>Conformance</td>
                    </OverlayTrigger>
                    <td>
                      {(
                        (1 -
                          profileReport.table.n_cells_missing /
                            (profileReport.table.n *
                              profileReport.table.n_var)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table
                className="table table-bordered table-sm"
                style={{ width: 1070 }}
              >
                <thead>
                  <tr className="border">
                    <th colspan="3">Columns Info</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(profileReport.variables).map((column) => (
                    <tr key={column} className="border">
                      <td
                        style={{
                          width: 150,
                          // textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      >
                        {column}
                      </td>
                      <td width={480}>
                        <table className="table table-bordered table-sm m-0">
                          <tbody>
                            <tr key={"type"}>
                              <td width={190}>Type</td>
                              <td>{profileReport.variables[column].type}</td>
                            </tr>
                            <tr key={"count"}>
                              <td>Count</td>
                              <td>{profileReport.variables[column].n}</td>
                            </tr>
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr key={"unique"}>
                                <td>Unique</td>
                                <td>
                                  {profileReport.variables[column].n_unique}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr key={"not_unique"}>
                                <td>Not Unique</td>
                                <td>
                                  {profileReport.variables[column].count -
                                    profileReport.variables[column].n_unique}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr key={"distinct"}>
                                <td>Distinct</td>
                                <td>
                                  {profileReport.variables[column].n_distinct}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr key={"non_distinct"}>
                                <td>Non Distinct</td>
                                <td>
                                  {profileReport.variables[column].count -
                                    profileReport.variables[column].n_distinct}
                                </td>
                              </tr>
                            )}
                            <tr key={"null"}>
                              <td>Null</td>
                              <td>
                                {profileReport.variables[column].n_missing}
                              </td>
                            </tr>
                            <tr key={"not_null"}>
                              <td>Not Null</td>
                              <td>
                                {profileReport.variables[column].n -
                                  profileReport.variables[column].n_missing}
                              </td>
                            </tr>
                            <tr key={"conformance"}>
                              <OverlayTrigger
                                key="top"
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    Ratio of the number of not null rows divided
                                    by the total number of rows
                                  </Tooltip>
                                }
                              >
                                <td>Conformance</td>
                              </OverlayTrigger>
                              <td>
                                {(
                                  ((profileReport.variables[column].n -
                                    profileReport.variables[column].n_missing) /
                                    profileReport.variables[column].n) *
                                  100
                                ).toFixed(2)}
                                %
                              </td>
                            </tr>
                            {profileReport.variables[column].type ===
                              "Categorical" && (
                              <tr key={"max_length"}>
                                <td>Max Length</td>
                                <td>
                                  {getMaxLength(
                                    JSON.stringify(
                                      profileReport.dataframe[column]
                                    )
                                  )}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Categorical" && (
                              <tr key={"min_length"}>
                                <td>Min Length</td>
                                <td>
                                  {getMinLength(
                                    JSON.stringify(
                                      profileReport.dataframe[column]
                                    )
                                  )}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"mean"}>
                                <td>Mean</td>
                                <td>{profileReport.variables[column].mean}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"median"}>
                                <td>Median</td>
                                <td>
                                  {getMedian(
                                    JSON.stringify(
                                      profileReport.dataframe[column]
                                    )
                                  )}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"standard_deviation"}>
                                <td>Standard Deviation</td>
                                <td>{profileReport.variables[column].std}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"max"}>
                                <td>Max</td>
                                <td>{profileReport.variables[column].max}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"min"}>
                                <td>Min</td>
                                <td>{profileReport.variables[column].min}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"sum"}>
                                <td>Sum</td>
                                <td>{profileReport.variables[column].sum}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"range"}>
                                <td>Range</td>
                                <td>{profileReport.variables[column].range}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"variance"}>
                                <td>Variance</td>
                                <td>
                                  {profileReport.variables[column].variance}
                                </td>
                              </tr>
                            )}

                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr key={"distribution"}>
                                <td>Distribution</td>
                                <td>
                                  <div>
                                    {" "}
                                    5% :{" "}
                                    {profileReport.variables[column][
                                      "5%"
                                    ].toFixed(2)}
                                  </div>
                                  <div>
                                    25% :{" "}
                                    {profileReport.variables[column][
                                      "25%"
                                    ].toFixed(2)}
                                  </div>
                                  <div>
                                    50% :{" "}
                                    {profileReport.variables[column][
                                      "50%"
                                    ].toFixed(2)}
                                  </div>
                                  <div>
                                    75% :{" "}
                                    {profileReport.variables[column][
                                      "75%"
                                    ].toFixed(2)}
                                  </div>
                                  <div>
                                    95% :{" "}
                                    {profileReport.variables[column][
                                      "95%"
                                    ].toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                      <td width={430}>
                        {(profileReport.variables[column].type === "Numeric" ||
                          profileReport.variables[column].type ===
                            "Boolean") && (
                          <tr>
                            <td className="border p-2">
                              <div
                                style={{
                                  width: 410,
                                }}
                              >
                                <DataLineChart
                                  dataset={JSON.stringify(
                                    profileReport.dataframe[column]
                                  )}
                                  type={profileReport.variables[column].type}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                        {profileReport.variables[column].type !== "Boolean" && (
                          <tr>
                            <td className="border p-2">
                              <div
                                style={{
                                  width: 410,
                                }}
                              >
                                <FrequencyChart
                                  dataset={JSON.stringify(
                                    profileReport.dataframe[column]
                                  )}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                        {profileReport.variables[column].type === "Numeric" && (
                          <tr>
                            <td className="border p-2">
                              <div
                                style={{
                                  width: 410,
                                }}
                              >
                                <ProfileChart
                                  dataset={profileReport.variables[column]}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border p-2" style={{ maxWidth: 1080 }}>
              <h5>Sample Data</h5>
              <div className="mb-3">
                <span>First Rows</span>
                <SampleTable
                  dataList={profileReport.head}
                  variables={profileReport.variables}
                />
              </div>
              <div className="mb-0">
                <span>Last Rows</span>
                <SampleTable
                  dataList={profileReport.tail}
                  variables={profileReport.variables}
                />
              </div>
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
              <div className=" col-5 text-end pt-3">
                <Button
                  className="btn btn-danger"
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "orangered",
                    borderColor: "orangered",
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-8 text-start pt-3">
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
          <div className="col-4 text-end pt-3">
            <Button
              className="btn btn-danger"
              onClick={handleSubmit}
              style={{
                backgroundColor: "orangered",
                borderColor: "orangered",
              }}
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunProfiling;

function SampleTable({ dataList = [], variables }) {
  const columns = Object.keys(variables);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm">
        <thead>
          <tr className="border">
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>
                  {(row[column] === true && "true") ||
                    (row[column] === false && "false") ||
                    row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getMedian(dataset) {
  const data_values = Object.values(JSON.parse(dataset));
  const arr = data_values.filter((val) => !!val);
  const len = arr.length;
  arr.sort(function (a, b) {
    return a - b;
  });
  const mid = Math.ceil(len / 2);
  const median = len % 2 === 0 ? (arr[mid] + arr[mid - 1]) / 2 : arr[mid - 1];
  return median;
}

function getMaxLength(dataset) {
  const data_values = Object.values(JSON.parse(dataset));
  const arr = data_values.filter((val) => !!val);
  const maxlen = Math.max(...arr.map((el) => el.length));
  return maxlen;
}

function getMinLength(dataset) {
  const data_values = Object.values(JSON.parse(dataset));
  const arr = data_values.filter((val) => !!val);
  const minlen = Math.min(...arr.map((el) => el.length));
  return minlen;
}

function getFrequency(table) {
  // eslint-disable-next-line no-array-constructor
  var arr = new Array();
  for (let i = 0; i < table.length; i++) {
    arr.push(table[i].dtype);
  }
  var unique_val = [...new Set(arr)];
  // eslint-disable-next-line no-array-constructor
  var final_data = new Array();
  for (let j = 0; j < unique_val.length; j++) {
    var data = {};
    data["type"] = unique_val[j];
    let count = arr.filter((x) => x === unique_val[j]).length;
    data["frequency"] = (count / arr.length) * 100;
    final_data.push(data);
  }
  return final_data;
}
