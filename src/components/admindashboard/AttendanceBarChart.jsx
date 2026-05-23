// src/components/AttendanceBarChart.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function splitLabel(text, maxLength = 12, maxLines = 2) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLength) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;

      // 최대 줄 수에 도달하면 남은 단어도 이어 붙임
      if (lines.length === maxLines - 1) {
        currentLine += ' ' + words.slice(words.indexOf(word) + 1).join(' ');
        break;
      }
    }
  }

  lines.push(currentLine.trim());

  // 최대 줄 수까지만 반환
  return lines.slice(0, maxLines);
}


export default function AttendanceBarChart() {
   const rawLabels = [
    'AI 플랫폼 운영관리 과정',
    '개발자 양성 과정',
    '파이썬 프로그래밍 기초',
    'AI·클라우드 데이터 연계 플랫폼 개발자',
    '빅데이터 분석 서비스 개발자 과정'
    ];
    
   const labels = rawLabels.map((label) => splitLabel(label, 10, 2)); //x 라벨 표시 조절 

    const data = {
    labels,
    datasets: [
      {
        label: '출석률 (%)',
        data: [85, 95, 90, 70 ,80],
        backgroundColor: ['#6BBCFF', '#6BBCFF', '#6BBCFF', '#FF6BD3','#6BBCFF'],
        borderRadius: 10,
        barThickness: 30, //그래프 두께
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
        x: {
        ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
            font: {
              size: 10,
            },
        },
         },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
            stepSize: 50, //스템 사이즈 
            },
        },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white" >
      <h2 className="text-sm font-semibold mb-2">강의별 현재 출석률</h2>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] text-gray-400">단위: %</span>
        <span className="text-[11px] text-gray-400">2025-06-11 13:00 기준</span>
      </div >
      <div className="h-[380px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
