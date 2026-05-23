// src/components/EmploymentBarChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function EmploymentBarChart() {
  const labels = [
    ['AI플랫폼','운영관리 과정'],
    ['빅데이터 분석','서비스 개발자 과정'],
    ['프론트엔드','개발자 과정'],
    ['파이썬', '프로그래밍 기초'],
  ];

  const data = {
    labels,
    datasets: [
      {
        data: [90, 70, 60, 40],
        backgroundColor: ['#10B981', '#60A5FA', '#60A5FA', '#F472B6'],
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
          left: 0,
          right: 0, // 오른쪽 여백 없애기
        },
      },

    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
        },
        grid: { color: '#e5e7eb' }, // gray-200
      },
      y: {
        ticks: {
          font: { size: 12 },
          padding: 0,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.parsed.x}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 h-[260px]">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>단위: %</span>
        <span>2025-06-11 13:00 기준</span>
      </div>
      <Bar data={data} options={options} height={260} />
    </div>
  );
}
