import React, { useEffect, useState } from "react";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ge_api_url } from "../../config/api";
import { Backdrop, CircularProgress } from "@mui/material";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const styles = {
  statisticCard: {
    width: "80%",
    height: "75px",
  },
};

function Overview() {
  const [resultsforDougnut, setResultsforDougnut] = useState([]);
  const [resultsforPie, setResultsforPie] = useState([]);
  const [processData, setProcessData] = useState({});
  const [resourceCountData, setResourceCountData] = useState({});
  const [allData, SetAllData] = useState([]);
  const [selectedDatasource, setSelectedDatasource] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState("all");
  const [selectedCDE, setSelectedCDE] = useState("all");
  const [datasourceList, setDatasourceList] = useState([]);
  const [dataAssetList, setDataAssetList] = useState([]);
  const [cdesList, setCDEsList] = useState([]);
  const [dimensionList, setDimensionList] = useState([]);
  const [ruleList, setRuleList] = useState([]);
  const [filterJson, setFilterJson] = useState({});
  const [loading, setLoading] = useState(false);

  function resultPreparationforDoughnut(data = []) {
    const dimensions = [
      "accessibility",
      "accuracy",
      "completeness",
      "consistency",
      "integrity",
      "precision",
      "uniqueness",
      "validity",
    ] || [...new Set(data.map(({ dq_dimension }) => dq_dimension))];
    const results = dimensions.map((dimension) => {
      const filtered_data = data.filter(
        ({ dq_dimension }) => dq_dimension === dimension
      );
      const n_total = filtered_data.length;
      const n_success = filtered_data.filter(
        ({ result_status }) => result_status
      ).length;
      const n_failed = n_total - n_success;
      const p_success = (n_success / (n_total ? n_total : 1)) * 100;
      return { dimension: dimension, n_total, n_success, n_failed, p_success };
    });
    setResultsforDougnut(results);
    console.log(results);
  }

  function resultPreparationforPie(data = []) {
    const n_total = data.length;
    const n_success = data.filter(({ result_status }) => result_status).length;
    const p_success = (n_success / (n_total ? n_total : 1)) * 100;
    const p_failed = 100 - p_success;
    // console.log(n_total, n_success, p_success, p_failed);
    setResultsforPie([p_success, p_failed]);
  }

  function resultforRowProcessed(data = []) {
    let total_rows = 0;
    let total_failed = 0;
    data.map((item) => {
      console.log(JSON.parse(item.result_json));
      total_rows += JSON.parse(item.result_json).element_count | 0;
      total_failed += JSON.parse(item.result_json).unexpected_count | 0;
    });
    let total_success = total_rows - total_failed;
    console.log(total_rows);
    console.log(total_success);
    setProcessData({
      total_rows: total_rows,
      total_success: total_success,
      total_failed: total_failed,
    });
  }

  function resultResourcesCount(data = []) {
    const datasource_count = [
      ...new Set(data.map((item) => item.datasource_name)),
    ].length;
    const dataset_count = [...new Set(data.map((item) => item.dataset_name))]
      .length;
    const cde_count = [...new Set(data.map((item) => item.cde_name))].length;

    setResourceCountData({
      datasource_count: datasource_count,
      dataset_count: dataset_count,
      cde_count: cde_count,
    });
  }

  const loadReports = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        resultPreparationforDoughnut(res.data.reports_v1);
        resultPreparationforPie(res.data.reports_v1);
        resultforRowProcessed(res.data.reports_v1);
        resultResourcesCount(res.data.reports_v1);
        SetAllData(res.data.reports_v1);
        loadDatasources(res.data.reports_v1);
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
    resultPreparationforDoughnut(temp);
    resultPreparationforPie(temp);
    resultforRowProcessed(temp);
    resultResourcesCount(temp);
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
        <h5 className="text-center">Overview</h5>
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
              // style={{ width: "200px", height: "35px" }}
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
              // style={{ width: "200px", height: "35px" }}
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
              // style={{ width: "200px", height: "35px" }}
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
          {/* <div className="col-2">
            <label>Dimension</label>
            <select
              style={{ width: "200px", height: "35px" }}
              className="form-select"
              name="dq_dimension"
              // onChange={handleSelectDimension}
              disabled
            >
              <option value="all">All</option>
            </select>
          </div>
          <div className="col-3">
            <label>Rule</label>
            <select
              style={{ width: "350px", height: "35px" }}
              className="form-select"
              name="expectation_name"
              // onChange={handleSelectRule}
              disabled
            >
              <option value="all">All</option>
            </select>
          </div> */}
        </div>
      </form>
      <div className="row pb-2 mb-3 ">
        {resultsforDougnut.map((value) => (
          <div
            key={value.dimension}
            style={{
              width: `calc(300% / ${resultsforDougnut.length})`,
              maxWidth: "300px",
              height: 300,
            }}
          >
            <DataQualityDimensionDougnutGraph dataset={value} />
            <hr style={{ board: " 1px solid black", width: "109%" }} />
          </div>
        ))}
      </div>
      <div
        className="chart-center"
        style={{
          backgroundColor: "#D4EFDF",
          width: "850px",
        }}
      >
        <br />
        <div
          className="text-center"
          style={{
            display: "inline-block",
            width: "33%",
          }}
        >
          <div style={{ fontSize: "20px", color: "black" }}>
            Total Executions
          </div>
          <div
            style={{
              fontSize: "35px",
              fontFamily: "Consolas",
              color: "#0174DF",
            }}
          >
            {processData.total_rows}
          </div>
          <br />
          <div className="text-center">
            <button className="btn btn-primary" style={styles.statisticCard}>
              Total Datasources <br />
              {resourceCountData.datasource_count}
            </button>
          </div>
          <br />
        </div>

        <div
          className="text-center"
          style={{
            display: "inline-block",
            width: "33%",
          }}
        >
          <div style={{ fontSize: "20px", color: "black" }}>Passed</div>
          <div
            style={{
              fontSize: "35px",
              fontFamily: "Consolas",
              color: "#04B431",
            }}
          >
            {processData.total_success}
          </div>
          <br />
          <div className="text-center">
            <button className="btn btn-warning" style={styles.statisticCard}>
              Total Datasets <br />
              {resourceCountData.dataset_count}
            </button>
          </div>
          <br />
        </div>

        <div
          className="text-center "
          style={{
            display: "inline-block",
            width: "33%",
          }}
        >
          <div style={{ fontSize: "20px", color: "black" }}>Failed</div>
          <div
            style={{
              fontSize: "35px",
              fontFamily: "Consolas",
              color: "#FA5858",
            }}
          >
            {processData.total_failed}
          </div>
          <br />
          <div className="text-center">
            <button className="btn btn-info" style={styles.statisticCard}>
              Total Critical Data Elements <br />
              {resourceCountData.cde_count}
            </button>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}

export default Overview;

function DataQualityDimensionDougnutGraph({ dataset }) {
  const data = {
    labels: ["success", "failed"],
    datasets: [
      {
        data: [dataset.n_success, dataset.n_failed],
        backgroundColor: ["green", "#ff4259"],
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      title: {
        display: true,
        color: "black",
        text: dataset.dimension[0].toUpperCase() + dataset.dimension.slice(1),
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-center">
      <div style={{ backgroundColor: "#00CED1", height: "15%" }}>
        <Doughnut data={data} options={options} />
        <div
          className="text-center"
          style={{
            marginTop: -40,
            fontSize: "12px",
            fontFamily: "Consolas",
            color: "black",
          }}
        >
          {dataset.n_total
            ? Math.round(dataset.p_success) + "%" + " " + " of 100% "
            : "Chart is not available for selected data"}

          <div style={{ marginTop: -50 }}>{dataset.n_success}</div>
        </div>
        <div
          style={{
            marginBottom: -40,
            marginTop: -180,
            fontSize: "13px",
            color: "#000000",
          }}
        >
          {"Success : " + dataset.n_success}
        </div>
      </div>
      <div
        style={{
          marginBottom: -50,
          marginTop: 30,
          fontSize: "13px",
          color: "#000000",
        }}
      >
        {"Failed : " + dataset.n_failed}
      </div>
    </div>
  );
}
