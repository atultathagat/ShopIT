import React from 'react';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart
} from 'chart.js';
import { Line } from 'react-chartjs-2';
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SalesChart({salesData}) {
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' ,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis',
      },
    },
    scales: {
      y: {
        type: 'linear' ,
        display: true,
        position: 'left' ,
      },
      y1: {
        type: 'linear' ,
        display: true,
        position: 'right' ,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  const labels = salesData?.map(data => data.date)
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData?.map(data => data.sales),
        borderColor: 'green',
        backgroundColor: 'green',
        yAxisID: 'y',
      },
      {
        label: 'Order',
        data: salesData?.map(data => data.numOfOrders),
        borderColor: 'red',
        backgroundColor: 'red',
        yAxisID: 'y1',
      },
    ],
  };
  
  return <Line options={options} data={data} />;
}