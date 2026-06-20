import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
)

export default function PieChart({ dataList = [] }) {
  console.log(dataList)
  const data = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [dataList[0], dataList[1]],
        backgroundColor: ['DodgerBlue', '#d3003f'],
      },
    ],
  }
  const option = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  return (
    <div className="mx-auto" style={{ width: 222 }}>
      <Pie data={data} options={option} />
    </div>
  )
}
