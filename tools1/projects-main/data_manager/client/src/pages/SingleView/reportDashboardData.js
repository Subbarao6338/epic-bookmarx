export default function ReportDashboardData() {
  return (
    <div
      className="col m-2"
      style={{ backgroundColor: '#E5E8E8', borderRadius: 8 }}
    >
      <div className="text-center" style={{ color: 'black' }}>
        <b>Dashboard</b>
      </div>
      <div className="row m-2 text-center">
        <div
          className="col m-2 shadow"
          style={{ backgroundColor: '#1761D0', borderRadius: 8, height: 110 }}
        >
          <div
            style={{
              fontSize: '40px',
              fontFamily: 'Consolas',
            }}
          >
            2
          </div>
          <div
            style={{
              fontSize: '15px',
              fontFamily: 'Consolas',
            }}
          >
            Graviton Dashboards
          </div>
        </div>
        <div
          className="col m-2 shadow"
          style={{ backgroundColor: '#1761D0', borderRadius: 8, height: 110 }}
        >
          <div
            style={{
              fontSize: '40px',
              fontFamily: 'Consolas',
            }}
          >
            2
          </div>
          <div
            style={{
              fontSize: '15px',
              fontFamily: 'Consolas',
            }}
          >
            OSS and Enabling Frameworks
          </div>
        </div>
        <div
          className="col m-2 shadow"
          style={{ backgroundColor: '#1761D0', borderRadius: 8, height: 110 }}
        >
          <div
            style={{
              fontSize: '40px',
              fontFamily: 'Consolas',
            }}
          >
            1
          </div>
          <div
            style={{
              fontSize: '15px',
              fontFamily: 'Consolas',
            }}
          >
            Hyperscaler Dashboards
          </div>
        </div>
      </div>
    </div>
  )
}
