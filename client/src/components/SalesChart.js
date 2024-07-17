import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [dates, setDates] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sales')
      .then(response => {
        const data = response.data;
        const dates = data.map(item => new Date(item.date).toLocaleDateString());
        const sales = data.map(item => item.sales);

        setChartData({
          labels: dates,
          datasets: [{
            label: 'Sales',
            data: sales,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          }]
        });
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch sales data');
      });
  }, []);

  const handlePredict = () => {
    const dateArray = dates.split(',').map(date => date.trim());
    axios.post('http://localhost:5000/api/predict', { dates: dateArray })
      .then(response => {
        setPredictions(response.data.predictions);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch predictions');
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Sales Data</h2>
      <Line data={chartData} />
      <div>
        <h3>Predict Future Sales</h3>
        <input
          type="text"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          placeholder="Enter dates (e.g., 2024-08-01, 2024-08-02)"
        />
        <button onClick={handlePredict}>Predict</button>
      </div>
      {predictions && (
        <div>
          <h3>Predictions</h3>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
