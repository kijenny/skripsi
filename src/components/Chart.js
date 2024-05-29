import React, { useEffect, useRef } from 'react';
// import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ChartComponent = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Ensure that chartRef.current is a canvas element
    const canvas = chartRef.current;

    if (canvas) {
      // Clean up existing chart instance
      const existingChartInstance = canvas.chartInstance;
      if (existingChartInstance) {
        existingChartInstance.destroy();
      }

      // Create new chart instance
      const ctx = canvas.getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            x: [
              {
                type: 'time', // Use time scale for dates
                time: {
                  unit: 'month', // Display ticks by month
                },
              },
            ],
            y: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });

      // Attach the chart instance to the canvas
      canvas.chartInstance = newChartInstance;
    }
  }, [chartData]);

  if (!chartData) {
    // If chartData is null, create an empty canvas to avoid errors
    return <div>Loading chart...</div>;
  }

  return (
    <div className='w-auto h-auto' style={{ width: '100%', margin: '20px auto' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartComponent;
