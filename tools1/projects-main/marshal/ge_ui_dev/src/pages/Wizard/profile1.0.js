import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { ge_api_url } from '../../config/api'
import ProfileChart from './profileChart'
import DataLineChart from './dataLineChart'
import FrequencyChart from './frequencyChart'

function RunProfiling() {
  const [datasourceName, setDatasourceName] = useState(
    'Please Create/Select Datasource !!',
  )
  const [runLoading, setRunLoading] = useState(false)
  const [profileReport, setProfileReport] = useState(null)
  const [selectedAssets, setSelectedAssets] = useState([])
  const [dataColumns, setDataColumns] = useState([])
  const [assetForRun, setAssetForRun] = useState()

  const loadSelectedDatasource = () => {
    axios
      .get(`${ge_api_url}/ge/get_wizard_detail/`)
      .then((res) => {
        //console.log(res)
        const ds_name = res.data.detail.datasource_name
        const assets_ls = JSON.parse(res.data.detail.data_asset).list
        setDatasourceName(ds_name)
        setSelectedAssets(assets_ls)
        document.getElementById('datas_name').style.color = 'black'
      })
      .catch((err) => {
        console.error(err)
        document.getElementById('warning').style.display = ''
      })
  }

  const handleRunProfiler = (e) => {
    e.preventDefault()
    // loading button
    setRunLoading(true)
    var formDataORG = new FormData(e.target)
    var asset_for_run = formDataORG.get('data_asset_name')
    setAssetForRun(asset_for_run)
    // console.log(selectedAssets)
    const body = {
      datasource_name: datasourceName,
      data_asset_name: asset_for_run,
    }
    const formData = new FormData()
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value)
    })

    console.log(...formData)
    axios
      .post(`${ge_api_url}/ge/data_profiling/`, formData)
      .then((res) => {
        console.log(res.data)
        setProfileReport(res.data.report)
        var cols = Object.keys(res.data.report.variables)
        var col_with_dtypes = new Array()
        for (var val in cols) {
          var temp = {
            column: cols[val],
            dtype: res.data.report.variables[cols[val]]['type'],
          }
          col_with_dtypes.push(temp)
        }
        setDataColumns(col_with_dtypes)
        updateWizard(col_with_dtypes)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const updateWizard = (col_with_dtypes) => {
    const json_converted = JSON.stringify({ list: col_with_dtypes })
    const body = {
      all_cols: json_converted,
    }
    const formData = new FormData()
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value)
    })
    axios
      .post(`${ge_api_url}/ge/update_all_cols_to_wizard/`, formData)
      .then((res) => {
        //  console.log(res.data)
        handleClose()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleClose = () => {
    setRunLoading(false)
  }

  useEffect(() => {
    loadSelectedDatasource()
  }, [])

  return (
    <div>
      <h5 className="mb-2"> Basic Profiling: </h5>
      {profileReport ? (
        <div>
          <div className="p-1">
            {/* <a href="../../../../your_report.html">link</a> */}
            <div className="border" style={{ width: 400, margin: -1 }}>
              <table
                className="table table-bordered table-sm"
                style={{ width: 400, marginBottom: -1 }}
              >
                <thead>
                  <tr>
                    <th colspan="2"> Dataset Info :</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width={250}>Datasource Name</td>
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
                </tbody>
              </table>
            </div>
            <br />
            <div
              style={{ maxWidth: 1080, overflow: 'auto', margin: 0 }}
              className="border"
            >
              <table
                className="table table-bordered table-sm"
                style={{ marginBottom: 1 }}
              >
                <thead>
                  <th
                    colspan="3"
                    style={{
                      padding: 7,
                    }}
                  >
                    Columns Info :
                  </th>
                </thead>
                <tbody>
                  {Object.keys(profileReport.variables).map((column) => (
                    <td key={column} className="border">
                      <tr>
                        <th
                          className="border-bottom p-1 text-center border-dark"
                          style={{ textTransform: 'capitalize' }}
                        >
                          {column}
                        </th>
                      </tr>
                      <td>
                        <table
                          width={400}
                          className="table-bordered table-sm"
                          style={{ margin: -5 }}
                        >
                          <tbody>
                            <tr>
                              <td>Type</td>
                              <td>{profileReport.variables[column].type}</td>
                            </tr>
                            <tr>
                              <td>Count</td>
                              <td>{profileReport.variables[column].count}</td>
                            </tr>
                            <tr>
                              <td>Unique</td>
                              <td>
                                {profileReport.variables[column].n_unique}
                              </td>
                            </tr>
                            <tr>
                              <td>Distinct</td>
                              <td>
                                {profileReport.variables[column].n_distinct}
                              </td>
                            </tr>
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Mean</td>
                                <td>{profileReport.variables[column].mean}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Median</td>
                                <td>
                                  {getMedian(
                                    JSON.stringify(
                                      profileReport.dataframe[column],
                                    ),
                                  )}
                                </td>
                              </tr>
                            )}

                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Variance</td>
                                <td>
                                  {profileReport.variables[column].variance}
                                </td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Standard Deviation</td>
                                <td>{profileReport.variables[column].std}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Max</td>
                                <td>{profileReport.variables[column].max}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Min</td>
                                <td>{profileReport.variables[column].min}</td>
                              </tr>
                            )}
                            {/* <tr>
                              <td>Frequency</td>
                              <td>: {profileReport.variables[column].freq}</td>
                            </tr> */}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Range</td>
                                <td>{profileReport.variables[column].range}</td>
                              </tr>
                            )}
                            {profileReport.variables[column].type ===
                              'Numeric' && (
                              <tr>
                                <td>Sum</td>
                                <td>{profileReport.variables[column].sum}</td>
                              </tr>
                            )}
                            {(profileReport.variables[column]['5%'] ||
                              profileReport.variables[column]['25%'] ||
                              profileReport.variables[column]['50%'] ||
                              profileReport.variables[column]['75%'] ||
                              profileReport.variables[column]['95%']) && (
                              <tr>
                                <td>Distribution</td>
                                <td>
                                  <div>
                                    5% :{profileReport.variables[column]['5%']}
                                  </div>
                                  <div>
                                    25% :
                                    {profileReport.variables[column]['25%']}
                                  </div>
                                  <div>
                                    50% :
                                    {profileReport.variables[column]['50%']}
                                  </div>
                                  <div>
                                    75% :
                                    {profileReport.variables[column]['75%']}
                                  </div>
                                  <div>
                                    95% :
                                    {profileReport.variables[column]['95%']}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {(profileReport.variables[column].type ===
                              'Numeric' ||
                              profileReport.variables[column].type ===
                                'Boolean') && (
                              <tr>
                                <td colspan="2" className="p-2">
                                  <div
                                    style={{
                                      width: 400,
                                    }}
                                  >
                                    <DataLineChart
                                      dataset={JSON.stringify(
                                        profileReport.dataframe[column],
                                      )}
                                      type={
                                        profileReport.variables[column].type
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                            {(profileReport.variables[column].type ===
                              'Numeric' ||
                              profileReport.variables[column].type !==
                                'Boolean') && (
                              <tr>
                                <td colspan="2" className="p-2">
                                  <div
                                    style={{
                                      width: 400,
                                    }}
                                  >
                                    <FrequencyChart
                                      dataset={JSON.stringify(
                                        profileReport.dataframe[column],
                                      )}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                            {(profileReport.variables[column]['5%'] ||
                              profileReport.variables[column]['25%'] ||
                              profileReport.variables[column]['50%'] ||
                              profileReport.variables[column]['75%'] ||
                              profileReport.variables[column]['95%']) && (
                              <tr>
                                <td colspan="2" className="p-2">
                                  <div
                                    style={{
                                      width: 400,
                                    }}
                                  >
                                    <ProfileChart
                                      dataset={profileReport.variables[column]}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </td>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <div
              className="border"
              style={{ maxWidth: 1080, overflow: 'auto' }}
            >
              <h6 className="p-2 border-bottom">
                <b>Sample Data :</b>
              </h6>
              <div>
                <span className="mb-0 p-2">First Rows:</span>
                <SampleTable dataList={profileReport.head} />
              </div>
              <div style={{ marginBottom: 0 }}>
                <span className="p-2">Last Rows:</span>
                <SampleTable dataList={profileReport.tail} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRunProfiler} spellCheck={false}>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Datasource Name </label>
            </div>
            <div className="col-8">
              <lable id="datas_name" style={{ color: 'red' }}>
                {datasourceName}
              </lable>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <label className="form-label">Select Data Asset Name</label>
            </div>
            <div className="col-8">
              <select className="form-select" name="data_asset_name">
                {selectedAssets.map((asset_name) => (
                  <option key={asset_name} value={asset_name}>
                    {asset_name}
                  </option>
                ))}
              </select>
              <label
                id="warning"
                style={{ display: 'none', color: 'red', fontSize: '14px' }}
              >
                Please Select Data Assets in Prev Step !
              </label>
            </div>
          </div>
          <div className="text-end">
            <Button
              className="me-2"
              type="submit"
              disabled={runLoading}
              style={{ backgroundColor: 'orangered', borderColor: 'orangered' }}
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
                'Run Profiler'
              )}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RunProfiling

function SampleTable({ dataList = [] }) {
  const columns = Object.keys(dataList?.[0])
  return (
    <div className="table-responsive">
      <table
        className="table table-bordered table-sm"
        style={{ marginBottom: 1 }}
      >
        <thead>
          <tr className="border">
            {columns.map((column) => (
              <th key={column} style={{ textTransform: 'capitalize' }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getMedian(dataset) {
  const data_values = Object.values(JSON.parse(dataset))

  const arr = data_values.filter((val) => !!val)

  const len = arr.length

  arr.sort(function (a, b) {
    return a - b
  })

  const mid = Math.ceil(len / 2)

  const median = len % 2 === 0 ? (arr[mid] + arr[mid - 1]) / 2 : arr[mid - 1]

  return median
}
