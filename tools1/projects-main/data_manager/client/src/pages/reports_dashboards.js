import * as React from 'react'
import { Link } from 'react-router-dom'
import { httpget } from '../commonUtility/common_http'
import { fetch_reportsdetails_url } from '../commonUtility/api_urls'
const Dashboard = () => {
  const [dasboards, setDashboards] = React.useState([])
  const [reports, setReports] = React.useState([])
  const [frameworks, setframeworks] = React.useState([])
  React.useEffect(() => {
    const req_value = {
      params: {},
    }
    console.log(fetch_reportsdetails_url)
    httpget(fetch_reportsdetails_url, req_value).then((results) => {
      console.log(results)
      const temp_dash = []
      const temp_framework = []
      const temp_report = []
      // eslint-disable-next-line
      results.map((result) => {
        if (result['report_type'] === 'Dashboards') {
          temp_dash.push(result)
        }
        if (result['report_type'] === 'Frameworks') {
          temp_framework.push(result)
        }
        if (result['report_type'] === 'Reports') {
          temp_report.push(result)
        } else {
          return null
        }
      })
      setDashboards(temp_dash)
      setReports(temp_report)
      setframeworks(temp_framework)
    })
  }, [])
  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          Dashboard
        </h3>
        <p align="left">
          See a catalog of dashboards from across the enterprise
        </p>
        <hr />
        {/* ### REPORTS ### */}
        <div
          className=""
          style={{
            backgroundColor: 'rgba(240,240,240,0.37)',
            border: '2px solid #F2F2F2',
            borderRadius: 16,
            height: 200,
            width: 'auto',
            marginTop: 15,
          }}
        >
          <div align="left" style={{ padding: 15 }}>
            <b className="">Graviton Dashboards</b> |{' '}
            {typeof reports.length === 'undefined' ? 0 : reports.length}{' '}
            available
          </div>
          <div className="row ms-3 " style={{ height: 120 }}>
            {reports.map((report) => (
              <div
                className="col-2 border text-start p-2 ms-3 pb-1"
                style={{
                  width: 190,
                  backgroundColor: '#c8c8c84a',
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <Link
                  to={{ pathname: report.report_url }}
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <img
                    alt="thumbnail"
                    style={{ width: 170, height: 80 }}
                    src={require('../assets/reports_thumbnail/' +
                      report.report_thumbnail)}
                  />
                  <br />
                  <div
                    className="text-center"
                    style={{ color: 'black', fontSize: 14, fontWeight: 500 }}
                  >
                    {report.report_title}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* ### FRAMEWORKS ### */}
        <div
          className=""
          style={{
            backgroundColor: 'rgba(240,240,240,0.37)',
            border: '2px solid #F2F2F2',
            borderRadius: 16,
            height: 200,
            width: 'auto',
            marginTop: 15,
          }}
        >
          <div align="left" style={{ padding: 15 }}>
            <b className="">OSS and Enabling Frameworks</b> |{' '}
            {typeof frameworks.length === 'undefined' ? 0 : frameworks.length}{' '}
            available
          </div>
          <div className="row ms-3 " style={{ height: 120 }}>
            {frameworks.map((frameworks) => (
              <div
                className="col-2 border text-start p-2 ms-3 pb-1"
                style={{
                  width: 190,
                  backgroundColor: '#c8c8c84a',
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <Link
                  to={{ pathname: frameworks.report_url }}
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <img
                    alt="thumbnail"
                    style={{ width: 170, height: 80 }}
                    src={require('../assets/reports_thumbnail/' +
                      frameworks.report_thumbnail)}
                  />
                  <br />
                  <div
                    className="text-center"
                    style={{ color: 'black', fontSize: 14, fontWeight: 500 }}
                  >
                    {frameworks.report_title}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* ### DASHBOARDS ### */}
        <div
          className=""
          style={{
            backgroundColor: 'rgba(240,240,240,0.37)',
            border: '2px solid #F2F2F2',
            borderRadius: 16,
            height: 200,
            marginTop: 15,
          }}
        >
          <div align="left" style={{ padding: 15 }}>
            <b className="">Hyperscaler Dashboards</b> |{' '}
            {typeof dasboards.length === 'undefined' ? 0 : dasboards.length}{' '}
            available
          </div>
          <div className="row ms-3 " style={{ height: 120 }}>
            {dasboards.map((dashboard) => (
              <div
                className="col-2 border text-start p-2 ms-3 pb-1"
                style={{
                  width: 190,
                  backgroundColor: '#c8c8c84a',
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <Link
                  to={{ pathname: dashboard.report_url }}
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <img
                    alt="thumbnail"
                    style={{ width: 170, height: 80 }}
                    src={require('../assets/reports_thumbnail/' +
                      dashboard.report_thumbnail)}
                  />
                  <br />
                  <div
                    className="text-center"
                    style={{ color: 'black', fontSize: 14, fontWeight: 500 }}
                  >
                    {dashboard.report_title}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
