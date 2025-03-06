// frontend/src/ReservationForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ReservationForm() {
  const [reservation, setReservation] = useState({
    customerName: '',
    email: '',
    phone: '',
    rooms: [],
    checkInDate: '',
    checkInTime: '16:00',   // Default check-in time: 4:00 PM
    checkOutDate: '',
    checkOutTime: '11:00'   // Default check-out time: 11:00 AM
  });
  // Track the index of the last clicked room for shift selection
  const [lastRoomIndex, setLastRoomIndex] = useState(null);

  // List of available hotel rooms
  const hotelRooms = [
    '105', '107', '109',
    '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'
  ];

  // Update state for text inputs
  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  // Handle room toggle with shift-click support
  const handleRoomToggle = (room, index, event) => {
    let newRooms = [...reservation.rooms];
    // If shift key is pressed and we have a last selected index
    if (event.shiftKey && lastRoomIndex !== null) {
      const start = Math.min(lastRoomIndex, index);
      const end = Math.max(lastRoomIndex, index);
      // Select all rooms in the range (if not already selected)
      for (let i = start; i <= end; i++) {
        const currentRoom = hotelRooms[i];
        if (!newRooms.includes(currentRoom)) {
          newRooms.push(currentRoom);
        }
      }
    } else {
      // Normal toggle: remove if selected, otherwise add
      if (newRooms.includes(room)) {
        newRooms = newRooms.filter(r => r !== room);
      } else {
        newRooms.push(room);
      }
      // Update last clicked index
      setLastRoomIndex(index);
    }
    setReservation({ ...reservation, rooms: newRooms });
  };

  // Submit the form to add a reservation
  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine date and time fields into ISO-like strings (e.g., "2025-03-01T14:30")
    const checkIn = `${reservation.checkInDate}T${reservation.checkInTime}`;
    const checkOut = `${reservation.checkOutDate}T${reservation.checkOutTime}`;
    const dataToSend = {
      customerName: reservation.customerName,
      email: reservation.email,
      phone: reservation.phone,
      rooms: reservation.rooms,
      checkIn,
      checkOut
    };
    axios.post('http://localhost:5001/api/reservations', dataToSend)
      .then(response => {
        alert('Reservation added successfully!');
        setReservation({
          customerName: '',
          email: '',
          phone: '',
          rooms: [],
          checkInDate: '',
          checkInTime: '16:00',   // Reset to default check-in time
          checkOutDate: '',
          checkOutTime: '11:00'   // Reset to default check-out time
        });
        setLastRoomIndex(null);
      })
      .catch(error => {
        console.error('Error adding reservation:', error);
      });
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: 'auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '2px 2px 12px rgba(0,0,0,0.1)'
    }}>
      <h2>Reservation Management</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Contact Name:</label><br />
          <input
            type="text"
            name="customerName"
            value={reservation.customerName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={reservation.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label><br />
          <input
            type="tel"
            name="phone"
            value={reservation.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Select Room(s):</label><br />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginTop: '8px'
          }}>
            {hotelRooms.map((room, index) => (
              <button
                key={room}
                type="button"
                onClick={(e) => handleRoomToggle(room, index, e)}
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: reservation.rooms.includes(room) ? '#007BFF' : '#fff',
                  color: reservation.rooms.includes(room) ? '#fff' : '#000',
                  cursor: 'pointer'
                }}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '4%' }}>
          <div style={{ flex: '0 0 48%' }}>
            <label>Check-In Date:</label><br />
            <input
              type="date"
              name="checkInDate"
              value={reservation.checkInDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: '0 0 48%' }}>
            <label>Check-In Time:</label><br />
            <input
              type="time"
              name="checkInTime"
              value={reservation.checkInTime}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '4%' }}>
          <div style={{ flex: '0 0 48%' }}>
            <label>Check-Out Date:</label><br />
            <input
              type="date"
              name="checkOutDate"
              value={reservation.checkOutDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: '0 0 48%' }}>
            <label>Check-Out Time:</label><br />
            <input
              type="time"
              name="checkOutTime"
              value={reservation.checkOutTime}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Reservation
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;