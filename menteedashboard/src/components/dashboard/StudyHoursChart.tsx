import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1C1C1C',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 12,
      },
      callbacks: {
        title: () => 'Hours',
      },
    },
  },
  scales: {
    x: {
      type: 'category' as const,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        color: '#6B7280',
      },
    },
    y: {
      type: 'linear' as const,
      grid: {
        color: '#F1F5F9',
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        stepSize: 20,
        font: {
          size: 12,
        },
        color: '#6B7280',
        callback: function(value: number | string) {
          return `${value} Hr`;
        },
      },
      max: 80,
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const data = {
  labels,
  datasets: [
    {
      label: 'Study',
      data: [55, 35, 65, 45, 25],
      backgroundColor: '#FB923C',
      borderRadius: {
        topLeft: 4,
        topRight: 4,
      },
      barPercentage: 0.6,
    },
    {
      label: 'Tests',
      data: [15, 25, 32, 18, 10],
      backgroundColor: '#FDBA74',
      borderRadius: {
        topLeft: 4,
        topRight: 4,
      },
      barPercentage: 0.6,
    },
  ],
};

const StudyHoursChart = () => {
  return (
    <div className="h-[300px] relative">
      <Bar 
        options={options} 
        data={data}
        plugins={[
          {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart) => {
              const ctx = chart.canvas.getContext('2d');
              if (ctx) {
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
              }
            }
          }
        ]}
      />
    </div>
  );
};

export default StudyHoursChart;