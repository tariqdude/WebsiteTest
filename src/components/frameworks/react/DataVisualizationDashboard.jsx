// Data Visualization Dashboard with D3.js and Chart.js
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Chart from 'chart.js/auto';

const DataVisualizationDashboard = () => {
  const d3ChartRef = useRef(null);
  const chartJsRef = useRef(null);
  const [data, setData] = useState({
    sales: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    categoryData: Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 300)
    ),
  });

  // D3.js Bar Chart
  useEffect(() => {
    const svg = d3.select(d3ChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const chartSvg = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = chartSvg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.categories)
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.categoryData)])
      .range([height, 0]);

    // Create bars
    g.selectAll('.bar')
      .data(data.categoryData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(data.categories[i]))
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(d))
      .attr('height', (d) => height - yScale(d))
      .attr('fill', '#3B82F6')
      .attr('rx', 4)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#1D4ED8');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', '#3B82F6');
      });
    // Add axes`
    g.append('g')``
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale));

    // Add labels
    g.selectAll('.label')
      .data(data.categoryData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d, i) => xScale(data.categories[i]) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '12px')
      .text((d) => d);
  }, [data]);

  // Chart.js Line Chart
  useEffect(() => {
    const ctx = chartJsRef.current.getContext('2d');

    const chartInstance = new Chart(ctx, {
      type: 'line',`
      data: {``
        labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
        datasets: [
          {
            label: 'Sales Trend',
            data: data.sales,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Sales Performance',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        elements: {
          point: {
            hoverBackgroundColor: '#059669',
          },
        },
      },
    });

    return () => chartInstance.destroy();
  }, [data]);

  const refreshData = () => {
    setData({
      sales: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      categoryData: Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 300)
      ),
    });
  };

  return (
    <div className='w-full rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Data Visualization Dashboard
        </h3>
        <button
          onClick={refreshData}
          className='transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700'
        >
          Refresh Data
        </button>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* D3.js Chart */}
        <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
          <h4 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white'>
            D3.js Bar Chart
          </h4>
          <svg ref={d3ChartRef} className='w-full'></svg>
          <p className='mt-2 text-xs text-gray-600 dark:text-gray-400'>
            Interactive D3.js visualization with hover effects
          </p>
        </div>

        {/* Chart.js Chart */}
        <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
          <div className='relative h-64'>
            <canvas ref={chartJsRef}></canvas>
          </div>
          <p className='mt-2 text-xs text-gray-600 dark:text-gray-400'>
            Chart.js line chart with animations and responsive design
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
        {[
          {
            label: 'Total Sales',
            value: data.sales.reduce((a, b) => a + b, 0),
            color: 'blue',
          },
          {
            label: 'Average',
            value: Math.round(data.sales.reduce((a, b) => a + b, 0) / 12),
            color: 'green',
          },
          {
            label: 'Max Month',
            value: Math.max(...data.sales),
            color: 'purple',
          },
          {`
            label: 'Growth',``
            value: `+${Math.round(Math.random() * 20)}%`,
            color: 'orange',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className='rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center dark:from-gray-800 dark:to-gray-700'
          >
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {stat.value}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Powered by D3.js & Chart.js • Real-time data updates • Interactive
          elements
        </p>
      </div>
    </div>
  );
};
`
export default DataVisualizationDashboard;``