import React from "react";
import Chart from "react-apexcharts";

const UsageDonutchart = (props) => {
  const { donutData, id, labels, chartOptions } = props;

  return (
    <Chart
      options={{
        plotOptions: {
          pie: {
            donut: {
              size: "50%",
            },
          },
        },
        dataLabels: {
          formatter: function (val, opts) {
            return;
          },
        },
        chart: {
          id,
          width: "50%",
        },
       
        legend: {
          offsetX: 0,
          offsetY: -20,
          position: "right",
          width: "50%",

          horizontalAlign: "center",
          fontSize: "12px",
          formatter: function (val, opts) {
            var amount = opts.w.globals.series[opts.seriesIndex];

            var formatted_label =
              val.length > 12 ? val.substring(0, 11) + "..." : val;

            return (
              formatted_label +
              "<br/> " +
              "&#160; <b style='font-size: large;'>" +
              amount +
              "</b>"
            );
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
            breakpoint: 600,
            options: {
              chart: {
                width: "50%",
                height: 250,
              },
              legend: {
                show: true,
              },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "50%",
              },
              legend: {
                position: "right",
              },
            },
          },
        ],
        labels,
        ...chartOptions,
      }}
      height={700}
      series={donutData}
      type="donut"
      width="100%"
    />
  );
};

export default UsageDonutchart;
