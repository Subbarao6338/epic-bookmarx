import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart2({ dataset = [] }) {
  const expectation_suites = [
    ...new Set(
      dataset.map(({ expectation_suite_name }) => expectation_suite_name)
    ),
  ];
  const avg_success_percent = expectation_suites.map((suite_name) => {
    const filtered_data = dataset.filter((value) => {
      return value.expectation_suite_name === suite_name;
    });

    var sum = 0;
    filtered_data.forEach((element) => {
      sum += element.value?.statistics?.success_percent;
    });

    const avg = sum / filtered_data.length || 0;
    return avg;
  });
  const data = {
    labels: expectation_suites,
    datasets: [
      {
        label: "Average DQ Success (%)",
        data: avg_success_percent,
        borderColor: "rgb(150, 0, 255)",
        backgroundColor: "rgba(150, 0, 255, 0.5)",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Average Data Quality Against Rulesets",
      },
      legend: { display: false },
    },
    scales: {
      x: { max: 100, title: { display: true, text: "Average DQ Success(%)" } },
      y: { title: { display: true, text: "Ruleset Name" } },
    },
  };
  return <Bar options={options} data={data} />;
}
