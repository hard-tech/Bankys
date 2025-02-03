"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SoldChartProps {
  data: number[];
}

const SoldChart: React.FC<SoldChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => `Jour ${index + 1}`),
    datasets: [
      {
        label: 'Solde',
        data: data,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
        tension: 0.1
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution du solde',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Solde (€)',
        },
        ticks: {
          callback: (value) => `${value}€`
        }
      },
      x: {
        title: {
          display: true,
          text: 'Jours',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-80">
      <h2 className="text-xl font-semibold mb-4">Évolution du solde</h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SoldChart;