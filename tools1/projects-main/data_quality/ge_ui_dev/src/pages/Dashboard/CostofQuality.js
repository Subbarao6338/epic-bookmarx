import axios from "axios";
import React, { useState, useEffect } from "react";
import { ge_api_url } from "../../config/api";
import expectation_list from "../ExpectationSuite/expectation_list";
import { Line, Bar } from "react-chartjs-2";
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

function CostofQuality() {
  const [allData, SetAllData] = useState([]);
  const [dataForCOQbyTrends, setDataForCOQbyTrends] = useState([]);
  const [dataForCOQbyDimensions, setDataForCOQbyDimensions] = useState([]);
  const [dataForCOQbyCDEs, setDataForCOQbyCDEs] = useState([]);
  const [dataForCOQbyRules, setDataForCOQbyRules] = useState([]);
  const [selectedDatasource, setSelectedDatasource] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState("all");
  const [selectedCDE, setSelectedCDE] = useState("all");
  const [selectedDimension, setSelectedDimension] = useState("all");
  const [selectedRule, setSelectedRule] = useState("all");
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const [cdesList, setCDEsList] = useState([]);
  const [dimensionList, setDimensionList] = useState([]);
  const [ruleList, setRuleList] = useState([]);
  const [filterJson, setFilterJson] = useState({});
  const [loading, setLoading] = useState(false);

  function resultPreparationForCOQbyTrends(data = []) {
    // console.log(data);
    let req_data = [
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
      { coq: 0 },
    ];
    data.map((item) => {
      const run_time = new Date(item.updated_at);
      const month = run_time.getMonth();
      const cost_given = JSON.parse(item.expectation_config).kwargs.cost || 0;

      if (item.result_status) {
        req_data[month].coq +=
          cost_given * JSON.parse(item.result_json).unexpected_percent || 0;
      } else {
        req_data[month].coq +=
          cost_given * JSON.parse(item.result_json).unexpected_percent ||
          cost_given * 100;
      }
    });
    for (let x in req_data) {
      const today = new Date();
      if (x > today.getMonth()) {
        req_data[x].coq = "Undefined";
      }
    }
    const dataset_for_trend_graph = req_data.map((item) => item.coq);
    // console.log(dataset_for_trend_graph);
    setDataForCOQbyTrends(dataset_for_trend_graph);
  }

  function resultPreparationForCOQbyDimensions(data = []) {
    // console.log(data);
    const dq_dimensions = [...new Set(data.map((item) => item.dq_dimension))];
    // console.log(dq_dimensions);
    let dim_data_coq = new Array();
    // [
    //   { dimension: "Accessibility", coq: 0 },
    //   { dimension: "Accuracy", coq: 0 },
    //   { dimension: "Completeness", coq: 0 },
    //   { dimension: "Consistency", coq: 0 },
    //   { dimension: "Integrity", coq: 0 },
    //   { dimension: "Precision", coq: 0 },
    //   { dimension: "Uniqueness", coq: 0 },
    //   { dimension: "Validity", coq: 0 },
    // ];
    if (dq_dimensions.length > 0) {
      dq_dimensions.map((name, index) => {
        const new_data = data.filter((val) => val.dq_dimension === name);
        let temp_cost_json = {
          dq_dimension: name.charAt(0).toUpperCase() + name.slice(1),
          coq: 0,
        };
        new_data.map((item) => {
          const cost_given =
            JSON.parse(item.expectation_config).kwargs.cost || 0;
          if (item.result_status) {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent || 0;
          } else {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent ||
              cost_given * 100;
          }
        });
        dim_data_coq.push(temp_cost_json);
      });
      console.log(dim_data_coq);
      setDataForCOQbyDimensions(dim_data_coq);
    } else {
      let temp_cost_json = {
        dq_dimension: selectedDimension,
        coq: 0,
      };
      dim_data_coq.push(temp_cost_json);
      setDataForCOQbyDimensions(dim_data_coq);
    }
  }

  function resultPreparationForCOQbyCDEs(data = []) {
    // console.log(data);
    const diff_cde_list = [...new Set(data.map((item) => item.cde_name))];
    let arr_coq_by_cdes = new Array();
    if (diff_cde_list.length > 0) {
      diff_cde_list.map((value, index) => {
        let new_data = data.filter((val) => val.cde_name === value);
        // console.log(value, new_data);
        let temp_cost_json = {
          cde: value,
          coq: 0,
        };
        new_data.map((item) => {
          const cost_given =
            JSON.parse(item.expectation_config).kwargs.cost || 0;
          if (item.result_status) {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent || 0;
          } else {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent ||
              cost_given * 100;
          }
        });
        arr_coq_by_cdes.push(temp_cost_json);
      });
      var sortBycoq = arr_coq_by_cdes.sort(function (a, b) {
        return b.coq - a.coq;
      });
      setDataForCOQbyCDEs(sortBycoq.slice(0, 10));
    } else {
      let temp_cost_json = {
        cde: selectedCDE,
        coq: 0,
      };
      arr_coq_by_cdes.push(temp_cost_json);
      setDataForCOQbyCDEs(arr_coq_by_cdes);
    }
  }

  function resultPreparationForCOQbyRules(data = []) {
    // console.log(data);
    const diff_rule_list = [
      ...new Set(data.map((item) => item.expectation_name)),
    ];
    let arr_coq_by_rules = new Array();

    if (diff_rule_list.length > 0) {
      diff_rule_list.map((value, index) => {
        let new_data = data.filter((val) => val.expectation_name === value);
        // console.log(value, new_data);
        let temp_cost_json = {
          rule_name: value,
          coq: 0,
        };
        new_data.map((item) => {
          const cost_given =
            JSON.parse(item.expectation_config).kwargs.cost || 0;
          if (item.result_status) {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent || 0;
          } else {
            temp_cost_json.coq +=
              cost_given * JSON.parse(item.result_json).unexpected_percent ||
              cost_given * 100;
          }
        });
        arr_coq_by_rules.push(temp_cost_json);
      });
      var sortBycoq = arr_coq_by_rules.sort(function (a, b) {
        return b.coq - a.coq;
      });
      console.log(sortBycoq.slice(0, 10));
      setDataForCOQbyRules(sortBycoq.slice(0, 10));
    } else {
      let temp_cost_json = {
        rule_name: selectedRule,
        coq: 0,
      };
      arr_coq_by_rules.push(temp_cost_json);
      setDataForCOQbyRules(arr_coq_by_rules);
    }
  }

  const loadReports = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        SetAllData(res.data.reports_v1);
        loadDatasources(res.data.reports_v1);
        resultPreparationForCOQbyTrends(res.data.reports_v1);
        resultPreparationForCOQbyDimensions(res.data.reports_v1);
        resultPreparationForCOQbyCDEs(res.data.reports_v1);
        resultPreparationForCOQbyRules(res.data.reports_v1);
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
    setCDEsList([]);
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
    setDimensionList([]);
    handleFilterChange();
  };

  const handleSelectDataset = (e) => {
    setSelectedDataset(e.target.value);
    if (e.target.value === "all") {
      setCDEsList([]);
    } else {
      loadCDEsofDataset(e.target.value);
    }
    setDimensionList([]);
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
    resultPreparationForCOQbyTrends(temp);
    resultPreparationForCOQbyDimensions(temp);
    resultPreparationForCOQbyCDEs(temp);
    resultPreparationForCOQbyRules(temp);
  }

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    HandleFilter();
  }, [filterJson]);

  return (
    <div>
      {/* <div className="border p-1">
        <h5 className="text-center">Cost of Quality</h5>
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
      <div className="row">
        <div className="col-6">
          <COQbyTrends
            dataset={{
              data_for_graph: dataForCOQbyTrends,
            }}
          />
        </div>
        <div className="col-6">
          <COQbyDimensions
            dataset={{
              data_for_graph: dataForCOQbyDimensions,
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <COQbyCDEs
            dataset={{
              data_for_graph: dataForCOQbyCDEs,
            }}
          />
        </div>
        <div className="col-6">
          <COQbyRules
            dataset={{
              data_for_graph: dataForCOQbyRules,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CostofQuality;

function COQbyTrends({ dataset = {} }) {
  // console.log(dataset);
  const options = {
    responsive: true,
    fill: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "COQ by Trend",
      },
    },
    scales: {
      y: {
        min: 0,
        title: { display: true, text: "COQ ($)" },
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
      label: "Cost",
      // data: [
      //   190912, 172312, 151231, 131234, 124321, 112345, 111432, 102345, 98678,
      //   97654, 96754, 83412,
      // ],
      data: dataset.data_for_graph,
      borderColor: "rgb(93, 173, 226)",
      backgroundColor: "rgba(93, 173, 226, 0.5)",
      borderWidth: 1,
      pointStyle: "circle",
    },
  ];

  const data = {
    labels,
    datasets,
  };
  return <Line options={options} data={data} />;
}

function COQbyDimensions({ dataset = {} }) {
  const data = {
    labels: dataset.data_for_graph.map((item) => item.dq_dimension),
    // labels: [
    //   "Accessibility",
    //   "Accuracy",
    //   "Completeness",
    //   "Consistency",
    //   "Integrity",
    //   "Precision",
    //   "Uniqueness",
    //   "Validity",
    // ],
    datasets: [
      {
        label: "COQ By Dimensions",
        // data: [54332, 45643, 23451, 56473, 34521, 67854, 23411, 56432],
        data: dataset.data_for_graph.map((item) => item.coq),
        borderColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
        ],
        backgroundColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
        ],
      },
    ],
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Cost of Quality by Dimensions",
      },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "COQ ($)" } },
      y: { title: { display: true, text: "Dimensions" } },
    },
  };
  return <Bar options={options} data={data} />;
}

function COQbyCDEs({ dataset = {} }) {
  const data = {
    // labels: [
    //   "CDE1",
    //   "CDE2",
    //   "CDE3",
    //   "CDE4",
    //   "CDE5",
    //   "CDE6",
    //   "CDE7",
    //   "CDE8",
    //   "CDE9",
    //   "CDE10",
    // ],
    labels: dataset.data_for_graph.map((item) => item.cde),
    datasets: [
      {
        label: "COQ By Top 10 CDEs",
        // data: [
        //   54123, 23143, 23451, 43215, 34251, 45365, 65473, 12342, 76584, 12343,
        // ],
        data: dataset.data_for_graph.map((item) => item.coq),
        borderColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
          "#27AE60",
          "#F5B7B1",
        ],
        backgroundColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
          "#27AE60",
          "#F5B7B1",
        ],
      },
    ],
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Cost of Quality by CDEs",
      },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "COQ ($)" } },
      y: { title: { display: true, text: "Critical Data Elements" } },
    },
  };
  return <Bar options={options} data={data} />;
}

function COQbyRules({ dataset = {} }) {
  const data = {
    // labels: [
    //   "Rule1",
    //   "Rule2",
    //   "Rule3",
    //   "Rule4",
    //   "Rule5",
    //   "Rule6",
    //   "Rule7",
    //   "Rule8",
    //   "Rule9",
    //   "Rule10",
    // ],
    labels: dataset.data_for_graph.map((item) => item.rule_name),
    datasets: [
      {
        label: "COQ By Top 10 Rules",
        // data: [
        //   12343, 43253, 45362, 45765, 78654, 32422, 12342, 34522, 34215, 12343,
        // ],
        data: dataset.data_for_graph.map((item) => item.coq),
        borderColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
          "#27AE60",
          "#F5B7B1",
        ],
        backgroundColor: [
          "#CD6155",
          "#AF7AC5",
          "#5499C7",
          "#48C9B0",
          "#52BE80",
          "#F4D03F",
          "#EB984E",
          "#5D6D7E",
          "#27AE60",
          "#F5B7B1",
        ],
      },
    ],
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Cost of Quality by Rules",
      },
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "COQ ($)" } },
      y: { title: { display: true, text: "Expectaion Rules" } },
    },
  };
  return <Bar options={options} data={data} />;
}
