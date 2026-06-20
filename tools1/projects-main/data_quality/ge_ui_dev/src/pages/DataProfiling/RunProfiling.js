import React, { useEffect, useState } from "react";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ge_api_url } from "../../config/api";
import ProfileChart from "./profileChart";
import DataLineChart from "./dataLineChart";
import FrequencyChart from "./frequencyChart";

// import FrequencyPercentageChart from './frequencyPercentageChart'
// import toDate from 'date-fns/toDate'

function RunProfiling() {
  const [selectedDatasource, setSelectedDatasource] = useState();
  const [runLoading, setRunLoading] = useState(false);
  const [profileReport, setProfileReport] = useState(null);
  const [dataColumns, setDataColumns] = useState([]);
  const [selectedassetForRun, setSelectedAssetForRun] = useState();
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);

  const loadDatasources = () => {
    axios
      .get(`${ge_api_url}/ge/list_datasources/`)
      .then((res) => {
        console.log(res);
        setDatasourceList(res.data.datasources);
        loadDataAssets(res.data.datasources[0].name);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const loadDataAssets = (datasource_name) => {
    setSelectedDatasource(datasource_name);
    axios
      .get(`${ge_api_url}/ge/list_data_assets/${datasource_name}/`)
      .then((res) => {
        console.log(res);
        setDataAssetList(res.data.data_assets);
        setSelectedAssetForRun(res.data.data_assets[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRunProfiler = (e) => {
    e.preventDefault();
    // loading button
    setRunLoading(true);
    var formData = new FormData(e.target);
    console.log(...formData);
    axios
      .post(`${ge_api_url}/ge/data_profiling/`, formData)
      .then((res) => {
        setProfileReport(res.data.report);
        var cols = Object.keys(res.data.report.variables);
        // eslint-disable-next-line no-array-constructor
        var col_with_dtypes = new Array();
        for (var val in cols) {
          var temp = {
            column: cols[val],
            dtype: res.data.report.variables[cols[val]]["type"],
          };
          col_with_dtypes.push(temp);
        }
        setDataColumns(col_with_dtypes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFullReportView = () => {
    axios
      .get(`${ge_api_url}/ge/get_html_report/`)
      .then((res) => {
        console.log(res);
        var report_window = window.open("get_html_report");
        report_window.document.write(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    setRunLoading(false);
  };

  useEffect(() => {
    loadDatasources();
  }, []);

  return (
    <div style={{ marginLeft: "15px" }}>
      {profileReport ? (
        <div>
          <div className="p-1">
            <div>
              <table
                className="table table-bordered table-sm"
                style={{ width: 450 }}
              >
                <thead className="border">
                  <tr>
                    <th colspan="2"> Dataset Info</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width={150}>Datasource Name</td>
                    <td width={250}>{selectedDatasource}</td>
                  </tr>
                  <tr>
                    <td>Data Asset Name</td>
                    <td>{selectedassetForRun}</td>
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
              <button
                className="btn btn-success"
                style={{
                  position: "absolute",
                  top: "160px",
                  right: "80px",
                }}
                onClick={handleFullReportView}
              >
                View Full Report
              </button>
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
                            <tr>
                              <td width={190}>Type</td>
                              <td>{profileReport.variables[column].type}</td>
                            </tr>
                            <tr>
                              <td>Count</td>
                              <td>{profileReport.variables[column].n}</td>
                            </tr>
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr>
                                <td>Unique</td>
                                <td>
                                  {profileReport.variables[column].n_unique}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr>
                                <td>Not Unique</td>
                                <td>
                                  {profileReport.variables[column].count -
                                    profileReport.variables[column].n_unique}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr>
                                <td>Distinct</td>
                                <td>
                                  {profileReport.variables[column].n_distinct}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type !==
                              "Boolean" && (
                              <tr>
                                <td>Non Distinct</td>
                                <td>
                                  {profileReport.variables[column].count -
                                    profileReport.variables[column].n_distinct}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td>Null</td>
                              <td>
                                {profileReport.variables[column].n_missing}
                              </td>
                            </tr>
                            <tr>
                              <td>Not Null</td>
                              <td>
                                {profileReport.variables[column].n -
                                  profileReport.variables[column].n_missing}
                              </td>
                            </tr>
                            <tr>
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
                              <tr>
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
                              <tr>
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
                              <tr>
                                <td>Mean</td>
                                <td>
                                  {profileReport.variables[column].mean.toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Median</td>
                                <td>
                                  {getMedian(
                                    JSON.stringify(
                                      profileReport.dataframe[column]
                                    )
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Standard Deviation</td>
                                <td>
                                  {profileReport.variables[column].std.toFixed(
                                    2
                                  )}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Max</td>
                                <td>{profileReport.variables[column].max}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Min</td>
                                <td>{profileReport.variables[column].min}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Sum</td>
                                <td>{profileReport.variables[column].sum}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Range</td>
                                <td>{profileReport.variables[column].range}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
                                <td>Variance</td>
                                <td>
                                  {profileReport.variables[
                                    column
                                  ].variance.toFixed(2)}
                                </td>
                              </tr>
                            )}

                            {profileReport.variables[column].type ===
                              "Numeric" && (
                              <tr>
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
          </div>
        </div>
      ) : (
        <form onSubmit={handleRunProfiler} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-3" style={{ textAlign: "left" }}>
              <label className="form-label">
                <b>Select Datasource Name</b>
              </label>
            </div>
            <div className="col-5">
              <select
                className="form-select"
                name="datasource_name"
                onChange={(e) => loadDataAssets(e.target.value)}
              >
                {datasourceList.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-3" style={{ textAlign: "left" }}>
              <label className="form-label">
                <b>Select Data Asset Name </b>
              </label>
            </div>
            <div className="col-5">
              <select
                className="form-select"
                name="data_asset_name"
                onChange={(e) => setSelectedAssetForRun(e.target.value)}
              >
                {dataAssetList.map((asset_name) => (
                  <option key={asset_name} value={asset_name}>
                    {asset_name}
                  </option>
                ))}
              </select>
            </div>
            <div className=" col-3 text-end">
              <Button
                className="me-2"
                type="submit"
                disabled={runLoading}
                style={{
                  backgroundColor: "orangered",
                  borderColor: "orangered",
                }}
              >
                {runLoading ? (
                  <>
                    <Spinner
                      className="me-2"
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
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
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
