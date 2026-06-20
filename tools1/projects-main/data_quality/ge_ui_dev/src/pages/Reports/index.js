import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTable } from "react-table";
import { ge_api_url } from "../../config/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: "*",
        id: "index",
        accessor: (_row, i) => i + 1,
      },
      {
        Header: "Datasource Name",
        accessor: "datasource_name",
      },
      {
        Header: "Target Dataset",
        accessor: "target_dataset",
      },
      {
        Header: "Rule Name",
        accessor: "rule_name",
      },
      {
        Header: "DQ Dimension",
        accessor: "dq_dimension",
      },
      {
        Header: "Execution Start",
        accessor: "execution_start",
      },
      {
        Header: "Execution End",
        accessor: "execution_end",
      },
      // {
      //   Header: 'Source Table',
      //   accessor: 'source_dataset',
      // },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ row }) => (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => deleteReportResult(row.values.id)}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );
  const data = React.useMemo(() => reports, [reports]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const loadReports = () => {
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        setReports(res.data.reports);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteReportResult = (id) => {
    axios
      .delete(`${ge_api_url}/ge/details_report/${id}/`)
      .then((res) => {
        console.log(res.data);
        setReports(res.data.reports);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div
      className="p-3"
      style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}
    >
      <div className="border">
        <div className="border p-1">
          <h4 className="text-center">
            <b>REPORTS</b>
          </h4>
        </div>
        <div>
          <DetailedReport />
        </div>
      </div>
    </div>
  );
}

export default Reports;

function DetailedReport() {
  const [results, setResults] = useState([]);

  function getResults() {
    axios
      .get(`${ge_api_url}/ge/details_report/`)
      .then((res) => {
        console.log(res.data);
        setResults(res.data.reports_v1);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getResults();
  }, []);

  return (
    <div className="mt-3 table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Run Name</th>
            <th>Datasource</th>
            <th>Data Set</th>
            <th>CDE</th>
            <th>Rule Set Name</th>
            <th>Rule Name</th>
            <th>Dimension</th>
            <th>Result</th>
            <th>Run Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((value) => (
            <tr key={value.id}>
              <td>{value.run_name}</td>
              <td>{value.datasource_name}</td>
              <td>{value.dataset_name}</td>
              <td>{value.cde_name}</td>
              <td>{value.expectation_suite_name}</td>
              <td>{value.expectation_name}</td>
              <td>{value.dq_dimension}</td>
              <td>{value.result_status ? "Success" : "Failed"}</td>
              <td>{value.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
