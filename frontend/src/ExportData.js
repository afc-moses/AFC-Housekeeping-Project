// frontend/src/ExportData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExportData() {
  const [reservations, setReservations] = useState([]);
  const [cleaningSchedule, setCleaningSchedule] = useState([]);

  // Fetch reservations and cleaning schedule data from the backend
  useEffect(() => {
    axios.get('http://localhost:5001/api/reservations')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));

    axios.get('http://localhost:5001/api/cleaning-schedule')
      .then(response => setCleaningSchedule(response.data))
      .catch(error => console.error('Error fetching cleaning schedule:', error));
  }, []);

  // Function to convert JSON array to CSV string
  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // header row
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ];
    return csvRows.join('\n');
  };

  // Function to trigger CSV download
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

  // Handler for exporting reservations
  const handleExportReservations = () => {
    const csv = convertToCSV(reservations);
    downloadCSV(csv, 'reservations.csv');
  };

  // Handler for exporting cleaning schedule
  const handleExportCleaningSchedule = () => {
    const csv = convertToCSV(cleaningSchedule);
    downloadCSV(csv, 'cleaning_schedule.csv');
  };

  return (
    <div>
      <h2>Export Data</h2>
      <div>
        <button onClick={handleExportReservations}>Export Reservations as CSV</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleExportCleaningSchedule}>Export Cleaning Schedule as CSV</button>
      </div>
    </div>
  );
}

export default ExportData;