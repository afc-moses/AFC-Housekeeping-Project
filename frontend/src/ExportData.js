import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExportData({ backendUrl }) {
  const [reservations, setReservations] = useState([]);
  const [cleaningSchedule, setCleaningSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsResponse = await axios.get(`${backendUrl}/api/reservations`);
        console.log('Fetched reservations:', reservationsResponse.data);
        setReservations(reservationsResponse.data);

        const cleaningResponse = await axios.get(`${backendUrl}/api/cleaning-schedule`);
        console.log('Fetched cleaning schedule:', cleaningResponse.data);
        setCleaningSchedule(cleaningResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [backendUrl]);

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];
    return csvRows.join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportReservations = () => {
    const csv = convertToCSV(reservations);
    downloadCSV(csv, 'reservations.csv');
  };

  const handleExportCleaningSchedule = () => {
    const csv = convertToCSV(cleaningSchedule);
    downloadCSV(csv, 'cleaning_schedule.csv');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Export Data</h2>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={handleExportReservations}
          style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Export Reservations as CSV
        </button>
        <button
          onClick={handleExportCleaningSchedule}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Export Cleaning Schedule as CSV
        </button>
      </div>
    </div>
  );
}

export default ExportData;