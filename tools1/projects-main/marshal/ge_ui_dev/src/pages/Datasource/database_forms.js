export const AthenaForm = () => (
  <div className="row mb-3">
    <label className="col-2 form-label">S3 Directory URL</label>
    <div className="col-10">
      <input
        type="fitextle"
        className="form-control"
        name="s3_dir_url"
        placeholder="Enter URL"
        required
      />
    </div>
  </div>
);

export const BigQueryForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">GCP Project Name</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="cgp_project_name"
          placeholder="Enter Project Name"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">BigQuery Dataset</label>
      <div className="col-10">
        <input
          type="text"
          name="bigquery_dataset"
          placeholder="Enter Dataset"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const MssqlForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Username</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="mssql_username"
          placeholder="Enter Username"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Password</label>
      <div className="col-10">
        <input
          type="password"
          name="mssql_password"
          placeholder="Enter Password"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Host</label>
      <div className="col-10">
        <input
          type="text"
          name="mssql_host"
          placeholder="Enter Host"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Port</label>
      <div className="col-10">
        <input
          type="text"
          name="mssql_port"
          placeholder="Enter Port"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Database</label>
      <div className="col-10">
        <input
          type="text"
          name="mssql_database"
          placeholder="Enter Databse Name"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
  //    <div className="row mb-3">
  //      <label className="col-2 form-label">Driver</label>
  //      <div className="col-10">
  //        <input
  //          type="text"
  //          name="mssql_driver"
  //          placeholder="Enter Driver"
  //          className="form-control"
  //          required
  //        />
  //      </div>
  //    </div>
);

export const MysqlForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Username</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="mysql_username"
          placeholder="Enter Username"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Password</label>
      <div className="col-10">
        <input
          type="password"
          name="mysql_password"
          placeholder="Enter Password"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Host</label>
      <div className="col-10">
        <input
          type="text"
          name="mysql_host"
          placeholder="Enter Host"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Port</label>
      <div className="col-10">
        <input
          type="text"
          name="mysql_port"
          placeholder="Enter Port"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Database</label>
      <div className="col-10">
        <input
          type="text"
          name="mysql_database"
          placeholder="Enter Databse Name"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const PostgresqlForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Username</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="pg_username"
          placeholder="Enter Username"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Password</label>
      <div className="col-10">
        <input
          type="password"
          name="pg_password"
          placeholder="Enter Password"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Host</label>
      <div className="col-10">
        <input
          type="text"
          name="pg_host"
          placeholder="Enter Host"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Port</label>
      <div className="col-10">
        <input
          type="text"
          name="pg_port"
          placeholder="Enter Port"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Database</label>
      <div className="col-10">
        <input
          type="text"
          name="pg_database"
          placeholder="Enter Databse Name"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const RedshiftForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Username</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="rs_username"
          placeholder="Enter Username"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Password</label>
      <div className="col-10">
        <input
          type="password"
          name="rs_password"
          placeholder="Enter Password"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Host</label>
      <div className="col-10">
        <input
          type="text"
          name="rs_host"
          placeholder="Enter Host"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Port</label>
      <div className="col-10">
        <input
          type="text"
          name="rs_port"
          placeholder="Enter Port"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Database</label>
      <div className="col-10">
        <input
          type="text"
          name="rs_database"
          placeholder="Enter Databse Name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">SSL Mode</label>
      <div className="col-10">
        <input
          type="text"
          name="rs_sslmode"
          placeholder="Enter SSL Mode"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const SnowflakeForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Username</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="sn_username"
          placeholder="Enter Username"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Password</label>
      <div className="col-10">
        <input
          type="password"
          name="sn_password"
          placeholder="Enter Password"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Account Name</label>
      <div className="col-10">
        <input
          type="text"
          name="sn_account_name"
          placeholder="Enter Account Name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Database</label>
      <div className="col-10">
        <input
          type="text"
          name="sn_database"
          placeholder="Enter Database Name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Schema Name</label>
      <div className="col-10">
        <input
          type="text"
          name="sn_schema_name"
          placeholder="Enter Schema Name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Warehouse Name</label>
      <div className="col-10">
        <input
          type="text"
          name="sn_warehouse_name"
          placeholder="Enter Warehouse Name"
          className="form-control"
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <label className="col-2 form-label">Role Name</label>
      <div className="col-10">
        <input
          type="text"
          name="sn_role_name"
          placeholder="Enter Role Name"
          className="form-control"
          required
        />
      </div>
    </div>
  </div>
);

export const SQLiteForm = () => (
  <div>
    <div className="row mb-3">
      <label className="col-2 form-label">Path to DB File</label>
      <div className="col-10">
        <input
          className="form-control"
          type="text"
          name="db_path"
          placeholder="Enter Path of DB File"
          required
        />
      </div>
    </div>
  </div>
);
