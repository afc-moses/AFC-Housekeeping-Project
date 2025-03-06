import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoomAvailabilityPeriod({ backendUrl }) {
  const [reservations, setReservations] = useState([]);
  const [cleaningSchedule, setCleaningSchedule] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datesInRange, setDatesInRange] = useState([]);

  // List of all hotel rooms
  const hotelRooms = [
    '105', '107', '109',
    '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'
  ];

  // Fetch reservations and cleaning tasks from the backend
  const fetchData = async () => {
    try {
      const reservationsResponse = await axios.get(`${backendUrl}/api/reservations`);
      console.log('Fetched reservations:', reservationsResponse.data); // Log for debugging
      setReservations(reservationsResponse.data);

      const cleaningResponse = await axios.get(`${backendUrl}/api/cleaning-schedule`);
      console.log('Fetched cleaning schedule:', cleaningResponse.data); // Log for debugging
      setCleaningSchedule(cleaningResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl]); // Re-fetch when backendUrl changes

  // Helper: get all dates in range (inclusive)
  const getDatesInRange = (start, end) => {
    const startDt = new Date(start);
    const endDt = new Date(end);
    const dates = [];
    let current = new Date(startDt);
    while (current <= endDt) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // When user clicks "Show Availability"
  const handleShowAvailability = () => {
    if (startDate && endDate && startDate <= endDate) {
      const dates = getDatesInRange(startDate, endDate);
      setDatesInRange(dates);
    } else {
      alert("Please enter a valid date range.");
    }
  };

  // Check if a room is available on a given date
  const isRoomAvailableOn = (room, date) => {
    for (let res of reservations) {
      if (res.rooms.includes(room)) {
        if (date >= res.checkIn && date < res.checkOut) {
          return false;
        }
        if (date === res.checkOut) {
          const cleaningTask = cleaningSchedule.find(
            task => task.reservationId === res.id && task.cleaningDate === date
          );
          if (!(cleaningTask && cleaningTask.completed)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  return (
    <div style={{ maxWidth: '90%', margin: 'auto', padding: '20px' }}>
      <h2>Room Availability for a Selected Period</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: '8px' }}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginLeft: '8px' }}
          />
        </label>
        <button
          onClick={handleShowAvailability}
          style={{ marginLeft: '20px', padding: '8px 16px' }}
        >
          Show Availability
        </button>
      </div>
      {datesInRange.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Room</th>
              {datesInRange.map(date => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hotelRooms.map(room => (
              <tr key={room}>
                <td>{room}</td>
                {datesInRange.map(date => {
                  const available = isRoomAvailableOn(room, date);
                  return (
                    <td
                      key={date}
                      style={{
                        backgroundColor: available ? '#d4edda' : '#f8d7da',
                        textAlign: 'center'
                      }}
                    >
                      {available ? 'Available' : 'Not Available'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RoomAvailabilityPeriod;