import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTable } from "react-table";
import { ge_api_url } from "../../config/api";
import expectation_list from "../ExpectationSuite/expectation_list";
import { Backdrop, CircularProgress } from "@mui/material";

function Details() {
  const [allData, SetAllData] = useState([]);
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

  const loadReports = () => {
    setLoading(true);
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
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

  const loadDimensionofCDE = (cde) => {
    const dimension_list = new Array();
    allData.map((item) => {
      if (
        item.datasource_name === selectedDatasource &&
        item.dataset_name === selectedDataset &&
        item.cde_name === cde
      )
        dimension_list.push(item.dq_dimension);
    });
    setDimensionList([...new Set(dimension_list)]);
  };

  const loadRuleofDimension = (dimension) => {
    const filteredExpectations = expectation_list.filter(
      ({ dq_dimension }) => dq_dimension === dimension
    );
    const rule_list = new Array();
    filteredExpectations.map((item) => {
      rule_list.push(item.expectation_type);
    });
    // allData.map((item) => {
    //   if (
    //     item.datasource_name === selectedDatasource &&
    //     item.dataset_name === selectedDataset &&
    //     item.cde_name === selectedCDE
    //     // item.dq_dimension === dimension
    //   )
    //     rule_list.push(item.expectation_name);
    // });
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
    // if (e.target.value === "all") {
    //   setDimensionList([]);
    // } else {
    //   loadDimensionofCDE(e.target.value);
    // }
    handleFilterChange();
  };

  const handleSelectDimension = (e) => {
    setSelectedDimension(e.target.value);
    // if (e.target.value === "all") {
    //   loadRuleofDimension(e.target.value);
    // } else {
    loadRuleofDimension(e.target.value);
    // }
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

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="border-bottom">
      {/* <div className="border p-1">
        <h5 className="text-center">Details</h5>
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
              {/* <option value="all">All</option>
              {dimensionList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))} */}
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
      <DetailedReport filterdata={filterJson} />
    </div>
  );
}

export default Details;

function DetailedReport({ filterdata = {} }) {
  const [results, setResults] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);

  function HandleFilter(filterdata) {
    console.log(filterdata);
    const temp = results.filter((row) => {
      let flag = true;

      for (let [key, value] of Object.entries(filterdata)) {
        flag = flag & ((row[key] == value) | (value == "all"));
        console.log(flag);
      }
      return flag;
    });
    console.log(temp);
    setFilteredResult(temp);
  }

  function getResults() {
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        setResults(res.data.reports_v1);
        setFilteredResult(res.data.reports_v1);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getResults();
  }, []);

  useEffect(() => {
    HandleFilter(filterdata);
  }, [filterdata]);

  return (
    <div className="table-responsive" style={{ overflow: "auto" }}>
      <table className="table table-bordered table-hover table-striped table-sm">
        <thead>
          <tr>
            <th>Run Name</th>
            <th>Datasource</th>
            <th>Dataset</th>
            <th>CDE</th>
            <th>Rule Set Name</th>
            <th>Rule Name</th>
            <th>Dimension</th>
            <th>Result</th>
            {/* <th>Run Time</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredResult.map((value) => (
            <tr key={value.id}>
              <td>{value.run_name}</td>
              <td>{value.datasource_name}</td>
              <td>{value.dataset_name}</td>
              <td>{value.cde_name}</td>
              <td>{value.expectation_suite_name}</td>
              <td>{value.expectation_name}</td>
              <td>
                {value.dq_dimension.charAt(0).toUpperCase() +
                  value.dq_dimension.slice(1)}
              </td>
              <td>{value.result_status ? "Success" : "Failed"}</td>
              {/* <td>{value.created_at}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
