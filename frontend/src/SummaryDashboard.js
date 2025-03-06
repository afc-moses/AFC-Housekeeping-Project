// frontend/src/SummaryDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SummaryDashboard() {
  const [reservations, setReservations] = useState([]);
  const [periodType, setPeriodType] = useState('month'); // Default period type
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [endDate, setEndDate] = useState('');
  const [reservedRoomNights, setReservedRoomNights] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  // Define the list of hotel rooms
  const hotelRooms = [
    '105', '107', '109',
    '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'
  ];
  const totalRooms = hotelRooms.length;

  // Fetch reservations from the backend
  useEffect(() => {
    axios.get('http://localhost:5001/api/reservations')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  // Calculate end date based on period type and start date
  const calculateEndDate = (start, period) => {
    const startDt = new Date(start);
    let endDt = new Date(start);
    if (period === 'week') {
      endDt.setDate(startDt.getDate() + 6);
    } else if (period === 'month') {
      endDt.setMonth(startDt.getMonth() + 1);
      endDt.setDate(endDt.getDate() - 1);
    } else if (period === 'semiannual') {
      endDt.setMonth(startDt.getMonth() + 6);
      endDt.setDate(endDt.getDate() - 1);
    } else if (period === 'year') {
      endDt.setFullYear(startDt.getFullYear() + 1);
      endDt.setDate(endDt.getDate() - 1);
    }
    return endDt.toISOString().slice(0, 10);
  };

  // Update endDate when startDate or periodType changes
  useEffect(() => {
    const newEndDate = calculateEndDate(startDate, periodType);
    setEndDate(newEndDate);
  }, [startDate, periodType]);

  // Helper: Calculate overlapping nights between a reservation and the selected period
  const calculateOverlapNights = (resCheckIn, resCheckOut, periodStart, periodEnd) => {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const checkIn = new Date(resCheckIn);
    const checkOut = new Date(resCheckOut);
    const overlapStart = new Date(Math.max(start, checkIn));
    const overlapEnd = new Date(Math.min(end, checkOut));
    if (overlapStart >= overlapEnd) return 0;
    const diffTime = overlapEnd - overlapStart;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Recalculate reserved room nights and occupancy rate when dependencies change
  useEffect(() => {
    if (!startDate || !endDate) return;
    let totalReservedNights = 0;
    reservations.forEach(res => {
      if (res.checkIn && res.checkOut) {
        const overlap = calculateOverlapNights(res.checkIn, res.checkOut, startDate, endDate);
        totalReservedNights += overlap * (res.rooms ? res.rooms.length : 1);
      }
    });
    setReservedRoomNights(totalReservedNights);

    // Calculate total available room nights for the period
    const periodDays = ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const availableRoomNights = periodDays * totalRooms;
    const occupancy = availableRoomNights > 0 ? ((totalReservedNights / availableRoomNights) * 100).toFixed(2) : 0;
    setOccupancyRate(occupancy);
  }, [reservations, startDate, endDate, totalRooms]);

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        backgroundColor: '#f7f7f7',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Summary Dashboard</h2>
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '8px' }}>Period Type:</label>
            <select value={periodType} onChange={e => setPeriodType(e.target.value)} style={{ padding: '6px' }}>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="semiannual">Semi-Annual</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '8px' }}>Start Date:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '6px' }}/>
          </div>
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'center', fontSize: '1em', color: '#555' }}>
          <strong>Period:</strong> {startDate} to {endDate}
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around'
        }}>
          <div style={{
            flex: '0 0 45%',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Reserved Room Nights</p>
            <p style={{ fontSize: '1.5em', margin: 0 }}>{reservedRoomNights}</p>
          </div>
          <div style={{
            flex: '0 0 45%',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Available Room Nights</p>
            <p style={{ fontSize: '1.5em', margin: 0 }}>
              {totalRooms * (((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)}
            </p>
          </div>
          <div style={{
            flex: '0 0 45%',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Occupancy Rate</p>
            <p style={{ fontSize: '1.5em', margin: 0 }}>{occupancyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryDashboard;