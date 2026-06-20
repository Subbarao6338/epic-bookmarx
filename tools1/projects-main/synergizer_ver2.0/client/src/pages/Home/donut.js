import React from 'react'
import Chart from 'react-apexcharts'

const Donutchart = (props) => {
  const { data } = props

  const labels = data.map(({ job }) => job)
  const donutData_temp = data.map(({ _value }) => _value)
  const donutData = []
  donutData_temp.forEach((str) => {
    donutData.push(Number(str))
  })

  return (
    <Chart
      options={{
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
            },
          },
        },
        dataLabels: {
          formatter: function (val, opts) {
            return
          },
        },
        // chart: {
        //   width: "50%",
        // },
        tooltip: {
          enabled: true,
          custom: function (opts) {
            var metrics_name = opts.w.globals.seriesNames[opts.seriesIndex]
            var count = opts.w.globals.series[opts.seriesIndex]
            return '<b></b>' + metrics_name + '</br>' + '<b></b>' + count
          },
        },
        legend: {
          position: 'right',
          width: 'auto',
          fontSize: '12px',
          formatter: function (val, opts) {
            var count = opts.w.globals.series[opts.seriesIndex]

            var formatted_label =
              val.length > 12 ? val.substring(0, 11) + '...' : val

            return (
              formatted_label +
              "<br/> &#160; <b style='font-size: large;'>" +
              count +
              '</b>'
            )
          },
          show: true,
          floating: false,
          markers: {
            width: 5,
            height: 40,
            radius: 12,
            offsetX: 0,
            offsetY: 25,
          },
        },
        responsive: [
          {
            options: {
              chart: {
                width: 'auto',
                height: 'auto',
              },
              legend: {
                show: true,
                position: 'right',
              },
            },
          },
        ],
        labels,
      }}
      height="auto"
      series={donutData}
      type="donut"
      width={360}
    />
  )
}

export default Donutchart
