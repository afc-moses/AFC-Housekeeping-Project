import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditReservation({ backendUrl }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState({
    customerName: '',
    email: '',
    phone: '',
    rooms: [],
    checkInDate: '',
    checkInTime: '',
    checkOutDate: '',
    checkOutTime: ''
  });

  // List of available hotel rooms
  const hotelRooms = [
    '105', '107', '109',
    '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
    '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220'
  ];

  // Fetch the current reservation from the backend
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/reservations`);
        const found = response.data.find(r => r.id === Number(id));
        if (found) {
          const checkInDate = found.checkIn ? found.checkIn.slice(0, 10) : '';
          const checkInTime = found.checkIn ? found.checkIn.slice(11, 16) : '';
          const checkOutDate = found.checkOut ? found.checkOut.slice(0, 10) : '';
          const checkOutTime = found.checkOut ? found.checkOut.slice(11, 16) : '';
          setReservation({
            customerName: found.customerName || '',
            email: found.email || '',
            phone: found.phone || '',
            rooms: found.rooms || [],
            checkInDate,
            checkInTime,
            checkOutDate,
            checkOutTime
          });
        } else {
          alert('Reservation not found!');
          navigate('/reservation-list');
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
        alert('Error fetching reservation. See console for details.');
      }
    };

    fetchReservation();
  }, [id, navigate, backendUrl]);

  // Handle text inputs
  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  // Toggle room selection
  const handleRoomToggle = (room) => {
    let newRooms = [...reservation.rooms];
    if (newRooms.includes(room)) {
      newRooms = newRooms.filter(r => r !== room);
    } else {
      newRooms.push(room);
    }
    setReservation({ ...reservation, rooms: newRooms });
  };

  // Handle form submission for updating reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      const response = await axios.put(`${backendUrl}/api/reservations/${id}`, dataToSend);
      alert(response.data.message);
      navigate('/reservation-list');
      window.location.reload(); // Temporary refresh to update the list
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Error updating reservation. See console for details.');
    }
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
      <h2>Edit Reservation</h2>
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
            {hotelRooms.map(room => (
              <button
                key={room}
                type="button"
                onClick={() => handleRoomToggle(room)}
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
          Update Reservation
        </button>
      </form>
    </div>
  );
}

export default EditReservation;