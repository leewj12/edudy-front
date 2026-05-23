import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AttendanceLineChart() {
  const data = {
    labels: ['5월 3주', '5월 4주', '6월 1주', '6월 2주'],
    datasets: [
      {
        label: '출석률',
        data: [85, 87.2, 89, 90],
        borderColor: '#D9D9D9',
        backgroundColor: 'rgba(85, 85, 85, 0.1)',
        tension: 0.3, // 부드러운 곡선
        fill: false,
        pointBackgroundColor: '#959595',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 30,
        left: 10,
        right: 50,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        borderWidth: 2,
        radius: 6,
        hoverRadius: 7,
      },
    },
    scales: {
      y: {
        display: false,
        grid: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 12,
          },
          color: '#555',
        },
      },
    },
  };

  const drawLabelPlugin = {
    id: 'drawLabelPlugin',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((point, index) => {
          ctx.save();
          ctx.font = '12px Pretendard, sans-serif';
          ctx.fillStyle = '#333';
          ctx.textAlign = 'center';
          ctx.fillText(`${dataset.data[index]}%`, point.x, point.y - 10);

          // 마지막 점에서만 텍스트 추가
          if (index === dataset.data.length - 1) {
            ctx.font = 'bold 11px Pretendard, sans-serif';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText(`${dataset.data[index]}%`, point.x + 20, point.y + 5);
          }

          ctx.restore();
        });
      });
    },
  };

  return (
    <div style={{ height: '170px' }}>
      <Line data={data} options={options} plugins={[drawLabelPlugin]} />
    </div>
  );
}
