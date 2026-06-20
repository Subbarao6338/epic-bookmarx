import React, { useState, useEffect } from "react";
import {
  AthenaForm,
  BigQueryForm,
  MssqlForm,
  MysqlForm,
  PostgresqlForm,
  RedshiftForm,
  SnowflakeForm,
  SQLiteForm,
} from "./database_forms";

const databasesList = [
  {
    text: "Athena Database",
    value: "athena",
    jsx: AthenaForm,
  },
  {
    text: "BigQuery Database",
    value: "bigquery",
    jsx: BigQueryForm,
  },
  {
    text: "MSSQL Database",
    value: "mssql",
    jsx: MssqlForm,
  },
  {
    text: "MySQL Database",
    value: "mysql",
    jsx: MysqlForm,
  },
  {
    text: "PostgreSQL Database",
    value: "postgresql",
    jsx: PostgresqlForm,
  },
  {
    text: "Redshift Database",
    value: "redshift",
    jsx: RedshiftForm,
  },
  {
    text: "Snowflake Database",
    value: "snowflake",
    jsx: SnowflakeForm,
  },
  {
    text: "SQLite Database",
    value: "sqlite",
    jsx: SQLiteForm,
  },
];

export const DatabaseForm = () => {
  const [databaseForm, setDatabaseForm] = useState({ jsx: AthenaForm });

  const handleDatabaseSelection = (e) => {
    console.log(e.target.value);
    setDatabaseForm({
      jsx: databasesList.find(({ value }) => value === e.target.value).jsx,
    });
  };

  return (
    <div>
      <div className="row mb-3">
        <label className="col-2 form-label">Database</label>
        <div className="col-10">
          <select
            name="database_name"
            className="form-select"
            onChange={handleDatabaseSelection}
          >
            {databasesList.map(({ text, value }) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
      </div>
      <databaseForm.jsx />
    </div>
  );
};

export const LocalFileForm = () => (
  <div className="row mb-3">
    <label className="col form-label">Upload Files</label>
    <div className="col-10">
      <input
        type="file"
        name="files"
        multiple
        required
        className="form-control"
        accept=".csv,"
      />
    </div>
  </div>
);

export const AzureStorageForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Account Url</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="account_url"
          placeholder="Enter account url"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Account Key</label>
      <div className="col-10">
        <input
          type="text"
          name="account_key"
          placeholder="Enter account key"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Container</label>
      <div className="col-10">
        <input
          type="text"
          name="container"
          placeholder="Enter container name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row ">
      <label className="col-2 form-label">Base Directory</label>
      <div className="col-10">
        <input
          type="text"
          name="base_dir"
          placeholder="Enter base directory"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const ApacheKafkaForm = () => (
  <div style={{ backgroundColor: "white", padding: 10, marginBottom: 10 }}>
    <div className="row mb-3">
      <div className="col-2">
        <label className="form-label">Kafka Host</label>
      </div>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="servers"
          placeholder="Enter kafka server"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="col-2">
        <label className=" form-label">Kafka Topics</label>
      </div>
      <div className="col-10">
        <input
          type="text"
          name="topics"
          placeholder="Enter kafka topic"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="col-2">
        <label className=" form-label">Group Id</label>
      </div>
      <div className="col-10">
        <input
          type="text"
          name="group_id"
          placeholder="Enter consumer group id"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="col-2">
        <label className=" form-label">Connection String</label>
      </div>
      <div className="col-10">
        <input
          type="text"
          name="conn_str"
          placeholder="Enter connection string"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);
