import React, { useState, useEffect } from 'react'

const styles = {
  statisticCard: {
    width: '100%',
    color: '#fff',
    backgroundColor: '#42168a',
    border: 0,
    borderRadius: 8,
  },
}

function Reports1() {
  const [statistic, setStatistic] = useState({
    datasources_total: 0,
    metadata_total: 0,
    datapipeline_total: 0,
    settings_total: 0,
    organizations_total: 0,
    projects_total: 0,
    servicerequest_total: 0,
  })

  // const calculateStatistics = (validations = []) => {
  //   statistic.validations_total = validations.length
  //   validations.forEach((validation) => {
  //     statistic.validations_success += validation.value.success
  //     const results = validation.value.results
  //     statistic.rows_processed +=
  //       results.find(({ success }) => success).result.element_count || 0
  //     results.forEach((result) => {
  //       statistic.rows_failed += result.result.unexpected_count || 0
  //     })
  //   })
  //   //
  //   statistic.validations_failed =
  //     statistic.validations_total - statistic.validations_success
  //   statistic.validations_success_percent = Math.round(
  //     (statistic.validations_success / (statistic.validations_total || 1)) *
  //       100,
  //   )
  //   statistic.validations_failed_percent =
  //     100 - statistic.validations_success_percent
  //   //
  //   statistic.rows_success = statistic.rows_processed - statistic.rows_failed
  //   statistic.rows_failed_percent = Math.round(
  //     (statistic.rows_failed / (statistic.rows_processed || 1)) * 100,
  //   )
  //   statistic.rows_success_percent = 100 - statistic.rows_failed_percent
  //   // statistic
  //   setStatistic({ ...statistic })
  // }

  useEffect(() => {
    // loadValidations()
  }, [])

  return (
    <div>
      <div>
        <div className="row m-2">
          <div className="col-3">
            <h6 className="text-center">Organizations Count</h6>
            <button className="btn btn-primary" style={styles.statisticCard}>
              Total Organizations : {statistic.organizations_total} <br />
            </button>
          </div>
          <div className="col-3">
            <h6 className="text-center">Projects Count</h6>
            <button className="btn btn-success" style={styles.statisticCard}>
              Total Projects : {statistic.projects_total}
              <br />
            </button>
          </div>
          <div className="col-3">
            <h6 className="text-center">Service Requests Count</h6>
            <button className="btn btn-info" style={styles.statisticCard}>
              Total Service Requests : {statistic.servicerequest_total} <br />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports1
