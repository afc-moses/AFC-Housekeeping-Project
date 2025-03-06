// frontend/src/HousekeepingMinistryChart.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HousekeepingMinistryChart() {
  const [reservations, setReservations] = useState([]);
  const [viewType, setViewType] = useState('weekly'); // 'weekly' or 'monthly' use Bar, 'yearly' uses Line
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch reservations from the backend
  useEffect(() => {
    axios.get('http://localhost:5001/api/reservations')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  // Filter reservations by checkOut date within the selected period if dates are provided.
  const filteredReservations = useMemo(() => {
    if (!startDate || !endDate) return reservations;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return reservations.filter(res => {
      if (!res.checkOut) return false;
      const resDate = new Date(res.checkOut.slice(0, 10));
      return resDate >= s && resDate <= e;
    });
  }, [reservations, startDate, endDate]);

  // Group reservations by checkOut date (YYYY-MM-DD) and sum the number of rooms per day.
  const groupedData = useMemo(() => {
    const groups = {};
    filteredReservations.forEach(res => {
      if (res.checkOut && res.rooms) {
        const dateKey = res.checkOut.slice(0, 10); // Extract date part
        if (!groups[dateKey]) {
          groups[dateKey] = 0;
        }
        groups[dateKey] += res.rooms.length;
      }
    });
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(a) - new Date(b));
    const dataValues = sortedKeys.map(key => groups[key]);
    return { labels: sortedKeys, data: dataValues };
  }, [filteredReservations]);

  // Determine background colors for each day based on the room count.
  const backgroundColors = useMemo(() => {
    return groupedData.data.map(count => {
      if (count < 10) return 'rgba(75, 192, 75, 0.6)';       // green
      else if (count <= 20) return 'rgba(54, 162, 235, 0.6)';  // blue
      else if (count <= 30) return 'rgba(255, 99, 132, 0.6)';  // red
      else return 'rgba(201, 203, 207, 0.6)';                  // gray
    });
  }, [groupedData.data]);

  // Prepare the chart data
  const chartData = useMemo(() => {
    return {
      labels: groupedData.labels.length > 0 ? groupedData.labels : ['No Data'],
      datasets: [
        {
          label: 'Rooms to be Cleaned',
          data: groupedData.data.length > 0 ? groupedData.data : [0],
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
          fill: false,
        }
      ]
    };
  }, [groupedData, backgroundColors]);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Housekeeping Ministry Chart</h2>
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div>
          <label style={{ marginRight: '8px' }}>View Type:</label>
          <select value={viewType} onChange={e => setViewType(e.target.value)} style={{ padding: '6px' }}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>Start Date:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '6px' }}/>
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>End Date:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '6px' }}/>
        </div>
      </div>
      {viewType === 'yearly' ? (
        <Line 
          data={chartData}
          options={{
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Check-Out Day - Rooms to be Cleaned (Yearly View)' }
            },
            responsive: true,
            scales: {
              x: {
                ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Rooms' }
              }
            }
          }}
        />
      ) : (
        <Bar 
          data={chartData}
          options={{
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Check-Out Day - Rooms to be Cleaned' }
            },
            responsive: true,
            scales: {
              x: {
                ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Rooms' }
              }
            }
          }}
        />
      )}
    </div>
  );
}

export default HousekeepingMinistryChart;