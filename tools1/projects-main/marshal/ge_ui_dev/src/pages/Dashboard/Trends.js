import axios from "axios";
import React, { useState, useEffect } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import { ge_api_url } from "../../config/api";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import expectation_list from "../ExpectationSuite/expectation_list";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import { Backdrop, CircularProgress } from "@mui/material";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  // Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  // Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Trends() {
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const [cdesList, setCDEsList] = useState([]);
  const [ruleList, setRuleList] = useState([]);
  const [ruleSetList, setRuleSetList] = useState([]);
  const [allData, SetAllData] = useState([]);
  const [selectedDatasource, setSelectedDatasource] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState("all");
  const [selectedCDE, setSelectedCDE] = useState("all");
  const [selectedDimension, setSelectedDimension] = useState("all");
  const [selectedRule, setSelectedRule] = useState("all");
  const [filterJson, setFilterJson] = useState({});
  const [rulesAndCDEData, setRulesAndCDEData] = useState({
    rules: {
      total_: 0,
      success_: 0,
      failure_: 0,
      partial_: 0,
    },
    cdes: {
      total_: 0,
      success_: 0,
      failure_: 0,
      partial_: 0,
    },
  });
  const [dataForDQCTrend, setDataForDQCTrends] = useState({
    accuracy: Array(12).fill(0),
    integrity: Array(12).fill(0),
    completeness: Array(12).fill(0),
    uniqueness: Array(12).fill(0),
    precision: Array(12).fill(0),
    validity: Array(12).fill(0),
    consistency: Array(12).fill(0),
    accessibility: Array(12).fill(0),
  });
  const [dataForFailureAgeing, setDataForFailureAgeing] = useState([]);
  const [dataForlast24Hrs, setDataForlast24Hrs] = useState([]);
  const [dataForSuiteSuccess, setDataForSuiteSuccess] = useState([]);
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(false);

  function resultPreparationForRulesAndCDEs(data = []) {
    const ruleset_list = [
      ...new Set(data.map((item) => item.expectation_suite_name)),
    ];
    setRuleSetList(ruleset_list);
    console.log(ruleset_list);
    let rule_data = {
      total_: 0,
      success_: 0,
      failure_: 0,
      partial_: 0,
    };
    let cde_data = {
      total_: 0,
      success_: 0,
      failure_: 0,
      partial_: 0,
    };
    for (let x in ruleset_list) {
      let new_rule_data = data.filter(
        (item) => item.expectation_suite_name === ruleset_list[x]
      );
      let rule_name_list = [
        ...new Set(new_rule_data.map((row_data) => row_data.expectation_name)),
      ];
      let cde_list = [
        ...new Set(new_rule_data.map((row_data) => row_data.cde_name)),
      ];
      rule_data.total_ += rule_name_list.length;
      cde_data.total_ += cde_list.length;
      let json_rule_with_status = {};
      let json_cde_with_status = {};
      for (let x in rule_name_list) {
        let status_rule_data = new_rule_data.filter(
          (item) => item.expectation_name === rule_name_list[x]
        );
        let rule_status_list = [
          status_rule_data.map((status_data) => status_data.result_status),
        ];
        // console.log(rule_status_list);
        let success_rule_count = rule_status_list[0].filter(
          (val) => val === true
        ).length;
        let res = "";
        if (success_rule_count === rule_status_list[0].length) {
          res = "success";
          rule_data.success_ += 1;
        } else if (success_rule_count === 0) {
          res = "failure";
          rule_data.failure_ += 1;
        } else {
          res = "partial";
          rule_data.partial_ += 1;
        }
        json_rule_with_status[rule_name_list[x]] = {
          success_count: success_rule_count,
          failure_count: rule_status_list[0].length - success_rule_count,
          status: res,
        };
      }
      for (let x in cde_list) {
        let status_cde_data = new_rule_data.filter(
          (item) => item.cde_name === cde_list[x]
        );
        let cde_status_list = [
          status_cde_data.map((status_data) => status_data.result_status),
        ];
        console.log(cde_status_list);
        let success_cde_count = cde_status_list[0].filter(
          (val) => val === true
        ).length;
        let res = "";
        if (success_cde_count === cde_status_list[0].length) {
          res = "success";
          cde_data.success_ += 1;
        } else if (success_cde_count === 0) {
          res = "failure";
          cde_data.failure_ += 1;
        } else {
          res = "partial";
          cde_data.partial_ += 1;
        }
        json_cde_with_status[cde_list[x]] = {
          success_count: success_cde_count,
          failure_count: cde_status_list[0].length - success_cde_count,
          status: res,
        };
      }
      console.log(json_cde_with_status);
    }
    let rule_cde_details = {
      rules: rule_data,
      cdes: cde_data,
    };
    console.log(rule_cde_details);
    setRulesAndCDEData(rule_cde_details);
  }

  function resultPreparationForDQCTrends(data = []) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dq_dimensions = [
      "accuracy",
      "integrity",
      "completeness",
      "uniqueness",
      "precision",
      "validity",
      "consistency",
      "accessibility",
    ];
    dq_dimensions.map((name) => {
      const new_data = data.filter((val) => val.dq_dimension === name);
      let req_data = [
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
        { success: 0, failure: 0 },
      ];
      new_data.map((item) => {
        const run_time = new Date(item.updated_at);
        const month = run_time.getMonth();
        if (item.result_status) {
          req_data[month].success += 1;
        } else {
          req_data[month].failure += 1;
        }
      });
      for (let x in req_data) {
        const today = new Date();
        if (x <= today.getMonth()) {
          dataForDQCTrend[name][x] =
            100 *
              (req_data[x].success /
                (req_data[x].success + req_data[x].failure)) || 0;
          // console.log(req_data[x]);
        } else {
          dataForDQCTrend[name][x] =
            100 *
            (req_data[x].success / (req_data[x].success + req_data[x].failure));
        }
      }
    });
    console.log(dataForDQCTrend);
    setDataForDQCTrends({ ...dataForDQCTrend });
  }

  function resultPreparationForFailureAgeing(data = []) {
    const success_arr = [0, 0, 0];
    const failure_arr = [0, 0, 0];
    const data_less_3 = data.filter((val) => findDays(val.updated_at) < 3);
    const data_3_to_6 = data.filter(
      (val) => findDays(val.updated_at) >= 3 && findDays(val.updated_at) < 6
    );
    const data_above_6 = data.filter((val) => findDays(val.updated_at) >= 6);
    const succ_3 = data_less_3.filter(
      (item) => item.result_status === true
    ).length;
    const succ_3_6 = data_3_to_6.filter(
      (item) => item.result_status === true
    ).length;
    const succ_6 = data_above_6.filter(
      (item) => item.result_status === true
    ).length;
    success_arr[0] = 100 * (succ_6 / data_above_6.length);
    success_arr[1] = 100 * (succ_3_6 / data_3_to_6.length);
    success_arr[2] = 100 * (succ_3 / data_less_3.length);
    failure_arr[0] = 100 - success_arr[0];
    failure_arr[1] = 100 - success_arr[1];
    failure_arr[2] = 100 - success_arr[2];

    setDataForFailureAgeing([success_arr, failure_arr]);
  }

  function resultPreparationForlast24Hrs(data = [], val = []) {
    const currentDT = new Date();
    data = data.filter(
      (item) => currentDT - Date.parse(item.updated_at) < 24 * 60 * 60 * 1000
    );
    const ruleset_list = [
      ...new Set(data.map((item) => item.expectation_suite_name)),
    ];
    let val_arr = new Array();
    for (let x in ruleset_list) {
      let temp_val_arr = val.filter(
        ({ expectation_suite_name }) =>
          expectation_suite_name === ruleset_list[x]
      );
      val_arr = val_arr.concat(temp_val_arr);
    }
    console.log(val_arr);
    val_arr.sort(function (x, y) {
      const x_date = new Date(x.run_time);
      const y_date = new Date(y.run_time);
      return x_date - y_date;
    });
    console.log(val_arr);
    setDataForlast24Hrs(val_arr);
  }

  function resultPreparationForSuiteSuccess(data = [], val = []) {
    const ruleset_list = [
      ...new Set(data.map((item) => item.expectation_suite_name)),
    ];

    let val_arr = new Array();
    for (let x in ruleset_list) {
      let temp_val_arr = val.filter(
        ({ expectation_suite_name }) =>
          expectation_suite_name === ruleset_list[x]
      );
      val_arr = val_arr.concat(temp_val_arr);
    }
    setDataForSuiteSuccess(val_arr);
  }

  const loadReports = (ini_val = []) => {
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        SetAllData(res.data.reports_v1);
        loadDatasources(res.data.reports_v1);
        resultPreparationForRulesAndCDEs(res.data.reports_v1);
        resultPreparationForDQCTrends(res.data.reports_v1);
        resultPreparationForFailureAgeing(res.data.reports_v1);
        resultPreparationForlast24Hrs(res.data.reports_v1, ini_val);
        resultPreparationForSuiteSuccess(res.data.reports_v1, ini_val);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadDatasources = (all_data) => {
    const ds_list = [...new Set(all_data.map((item) => item.datasource_name))];
    setDatasourceList(ds_list);
  };

  const loadDatasetofDS = (ds_name) => {
    const dataset_list = new Array();
    allData.map((item) => {
      if (item.datasource_name === ds_name)
        dataset_list.push(item.dataset_name);
    });
    setDataAssetList([...new Set(dataset_list)]);
  };

  const loadCDEsofDataset = (dataset_name) => {
    const cdes_list = new Array();
    allData.map((item) => {
      if (
        item.datasource_name === selectedDatasource &&
        item.dataset_name === dataset_name
      )
        cdes_list.push(item.cde_name);
    });
    setCDEsList([...new Set(cdes_list)]);
  };

  const loadRuleofDimension = (dimension) => {
    const filteredExpectations = expectation_list.filter(
      ({ dq_dimension }) => dq_dimension === dimension
    );
    const rule_list = new Array();
    filteredExpectations.map((item) => {
      rule_list.push(item.expectation_type);
    });
    setRuleList([...new Set(rule_list)]);
  };

  const handleSelectDatasource = (e) => {
    setSelectedDatasource(e.target.value);
    if (e.target.value === "all") {
      setDataAssetList([]);
    } else {
      loadDatasetofDS(e.target.value);
    }
    setCDEsList([]);
    handleFilterChange();
  };

  const handleSelectDataset = (e) => {
    setSelectedDataset(e.target.value);
    if (e.target.value === "all") {
      setCDEsList([]);
    } else {
      loadCDEsofDataset(e.target.value);
    }
    handleFilterChange();
  };

  const handleSelectCDE = (e) => {
    setSelectedCDE(e.target.value);
    handleFilterChange();
  };

  const handleSelectDimension = (e) => {
    setSelectedDimension(e.target.value);
    loadRuleofDimension(e.target.value);
    handleFilterChange();
  };

  const handleSelectRule = (e) => {
    setSelectedRule(e.target.value);
    handleFilterChange();
  };

  const handleFilterChange = () => {
    setTimeout(() => {
      const filterForm = document.getElementById("filter_form_123");
      const formData = new FormData(filterForm);

      console.log(...formData);
      for (let [key, value] of formData) {
        filterJson[key] = value;
      }

      setFilterJson({ ...filterJson });
    }, 10);
  };

  function HandleFilter() {
    console.log(filterJson);
    const temp = allData.filter((row) => {
      let flag = true;
      for (let [key, value] of Object.entries(filterJson)) {
        flag = flag & ((row[key] == value) | (value == "all"));
        console.log(flag);
      }
      return flag;
    });
    console.log(temp);
    resultPreparationForRulesAndCDEs(temp);
    resultPreparationForDQCTrends(temp);
    resultPreparationForFailureAgeing(temp);
    resultPreparationForlast24Hrs(temp, validations);
    resultPreparationForSuiteSuccess(temp, validations);
  }

  const loadValidations = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/validations/`)
      .then((res) => {
        console.log(res.data);
        const ini_val = res.data.validations;
        setValidations(ini_val);
        loadReports(ini_val);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadValidations();
  }, []);

  useEffect(() => {
    HandleFilter();
  }, [filterJson]);

  return (
    <div>
      {/* <div className="border p-1">
        <h5 className="text-center">Quality Trends</h5>
      </div> */}
      {loading ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      <form id="filter_form_123">
        <div className="row mb-3">
          <div className="col">
            <label>Datasource </label>
            <select
              style={{ height: "35px" }}
              className="form-select"
              name="datasource_name"
              onChange={handleSelectDatasource}
            >
              <option value="all">All</option>
              {datasourceList.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Dataset</label>
            <select
              style={{ height: "35px" }}
              className="form-select"
              name="dataset_name"
              onChange={handleSelectDataset}
            >
              <option value="all">All</option>
              {dataAssetList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Critical Data Elements</label>
            <select
              style={{ height: "35px" }}
              className="form-select"
              name="cde_name"
              onChange={handleSelectCDE}
            >
              <option value="all">All</option>
              {cdesList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Dimension</label>
            <select
              style={{ height: "35px" }}
              className="form-select"
              name="dq_dimension"
              onChange={handleSelectDimension}
            >
              <option value="all">All</option>
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
          <div className="col">
            <label>Rule</label>
            <select
              style={{ height: "35px" }}
              className="form-select"
              name="expectation_name"
              onChange={handleSelectRule}
            >
              <option value="all">All</option>
              {ruleList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <div className="row mb-3">
        <div
          className="col-md-3"
          style={{
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          <br />
          <br />
          Rules
          <div
            style={{
              fontSize: "35px",
              fontFamily: "Consolas",
              color: "#0174DF",
            }}
          >
            {rulesAndCDEData.rules.total_}
          </div>
          <div>
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Always Success</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#00ad00",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.rules.success_}
              </div>
            </OverlayTrigger>
            <div
              style={{
                width: "6px",
                display: "inline-block",
              }}
            />
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Partial Success</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#ffb224",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.rules.partial_}
              </div>
            </OverlayTrigger>
            <div
              style={{
                width: "6px",
                display: "inline-block",
              }}
            />
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Always Failed</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#FF0000",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.rules.failure_}
              </div>
            </OverlayTrigger>
          </div>
        </div>
        <div
          className="col-md-3"
          style={{
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          <br />
          <br />
          Critical Data Elements
          <div
            style={{
              fontSize: "35px",
              fontFamily: "Consolas",
              color: "#0174DF",
            }}
          >
            {rulesAndCDEData.cdes.total_}
          </div>
          <div>
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Always Success</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#00ad00",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.cdes.success_}
              </div>
            </OverlayTrigger>
            <div
              style={{
                width: "6px",
                display: "inline-block",
              }}
            />
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Partial Success</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#ffb224",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.cdes.partial_}
              </div>
            </OverlayTrigger>
            <div
              style={{
                width: "6px",
                display: "inline-block",
              }}
            />
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={<Tooltip>Always Failed</Tooltip>}
            >
              <div
                style={{
                  padding: "15px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#FF0000",
                  fontSize: "30px",
                  display: "inline-block",
                }}
              >
                {rulesAndCDEData.cdes.failure_}
              </div>
            </OverlayTrigger>
          </div>
        </div>
        <div className="col-md-6" style={{ textAlign: "center" }}>
          <TrendsByDQDimension
            dataset={{
              data_for_graph: dataForDQCTrend,
              selected_dimension: selectedDimension,
            }}
          />
        </div>
      </div>
      <div className="row p-2 mb-3">
        <div className="col-12 col-md-4" style={{ textAlign: "center" }}>
          <FailureAgeing dataset={dataForFailureAgeing} />
        </div>
        <div className="col-12 col-md-4">
          <Chart1 dataset={dataForlast24Hrs} />
        </div>
        <div className="col-12 col-md-4">
          <Chart2 dataset={dataForSuiteSuccess} />
        </div>
      </div>
    </div>
  );
}

export default Trends;

function TrendsByDQDimension({ dataset = {} }) {
  console.log(dataset);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Data Quality Trend",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: "Data Quality Score(%)" },
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var datasets = [
    {
      label: "accessibility",
      data: dataset.data_for_graph["accessibility"],
      borderColor: "rgb(252,194,0)",
      backgroundColor: "rgba(252,194,0, 0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },

    {
      label: "accuracy",
      data: dataset.data_for_graph.accuracy,
      borderColor: "rgb(122,122,122)",
      backgroundColor: "rgba(122,122,122, 0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "completeness",
      data: dataset.data_for_graph.completeness,
      borderColor: "rgb(206,32,41)",
      backgroundColor: "rgba(206,32,41, 0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "consistency",
      data: dataset.data_for_graph.consistency,
      borderColor: "rgb(0,209,0)",
      backgroundColor: "rgba(0,209,0,0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "integrity",
      data: dataset.data_for_graph.integrity,
      borderColor: "rgb(255,148,201)",
      backgroundColor: "rgba(255,148,201,0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "precision",
      data: dataset.data_for_graph.precision,
      borderColor: "rgb(0,209,209)",
      backgroundColor: "rgba(0,209,209,0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "uniqueness",
      data: dataset.data_for_graph.uniqueness,
      borderColor: "rgb(173,173,0)",
      backgroundColor: "rgba(173,173,0,0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
    {
      label: "validity",
      data: dataset.data_for_graph["validity"],
      borderColor: "rgb(255,82,82)",
      backgroundColor: "rgba(255,82,82,0.5)",
      borderWidth: 1,
      pointStyle: "rect",
    },
  ];
  if (dataset.selected_dimension === "all") {
    datasets = datasets;
  } else {
    datasets = datasets.filter((el) => el.label === dataset.selected_dimension);
  }

  const data = {
    labels,
    datasets,
  };
  return <Line options={options} data={data} />;
}

function FailureAgeing({ dataset = [] }) {
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Failure Ageing",
      },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: " Status" }, stacked: true },
      y: { title: { display: true, text: "Classification" }, stacked: true },
    },
  };

  const data = {
    labels: ["Above 6 Days", "3 to 6 Days", "< 3 Days"],
    datasets: [
      {
        label: "Success",
        data: dataset[0],
        backgroundColor: "#82F390",
      },
      {
        label: "Failure",
        data: dataset[1],
        backgroundColor: "#FAB090",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

function findDays(date) {
  // console.log(date);
  const run_time = new Date(date);
  const current_time = new Date();
  const diffTime = Math.abs(current_time - run_time);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // console.log(diffDays + " days");
  return diffDays;
}
