// frontend/src/ReservationList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const navigate = useNavigate();

  // Fetch reservations from the backend
  const fetchReservations = () => {
    axios.get('http://localhost:5001/api/reservations')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Sort reservations by checkIn datetime (assuming ISO format)
  const sortedReservations = reservations.slice().sort((a, b) => {
    return new Date(a.checkIn) - new Date(b.checkIn);
  });

  // Filtering function: 
  // - Filter by customer name if searchText is provided (case‑insensitive).
  // - If filterStartDate and/or filterEndDate are provided, only include reservations that overlap the date range.
  const filteredReservations = sortedReservations.filter(res => {
    const nameMatch = res.customerName.toLowerCase().includes(searchText.toLowerCase());

    if (!filterStartDate && !filterEndDate) {
      return nameMatch;
    }

    const resCheckIn = new Date(res.checkIn);
    const resCheckOut = new Date(res.checkOut);
    let filterStart = filterStartDate ? new Date(filterStartDate) : null;
    let filterEnd = filterEndDate ? new Date(filterEndDate) : null;

    if (!filterStart && filterEnd) {
      filterStart = new Date(filterEnd);
    }
    if (!filterEnd && filterStart) {
      filterEnd = new Date(filterStart);
    }
    
    if (filterEnd) {
      filterEnd.setDate(filterEnd.getDate() + 1); // make end date inclusive
    }

    const dateMatch = resCheckIn < filterEnd && resCheckOut > filterStart;

    return nameMatch && dateMatch;
  });

  // Handler for deleting a reservation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      axios.delete(`http://localhost:5001/api/reservations/${id}`)
        .then(response => {
          alert(response.data.message);
          fetchReservations();
        })
        .catch(error => console.error('Error deleting reservation:', error));
    }
  };

  // Handler for editing a reservation: navigate to the edit-reservation page
  const handleEdit = (id) => {
    navigate(`/edit-reservation/${id}`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Reservation List</h2>
      
      {/* Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
        <input 
          type="text"
          placeholder="Search by customer name..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <div>
          <label style={{ marginRight: '8px' }}>From:</label>
          <input 
            type="date"
            value={filterStartDate}
            onChange={e => setFilterStartDate(e.target.value)}
            style={{ padding: '8px' }}
          />
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>To:</label>
          <input 
            type="date"
            value={filterEndDate}
            onChange={e => setFilterEndDate(e.target.value)}
            style={{ padding: '8px' }}
          />
        </div>
        <button 
          onClick={() => { setSearchText(''); setFilterStartDate(''); setFilterEndDate(''); }}
          style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear Filters
        </button>
      </div>
      
      {filteredReservations.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No reservations found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredReservations.map(reservation => (
            <div key={reservation.id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              width: '280px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ margin: '0 0 10px', color: '#007BFF' }}>{reservation.customerName}</h3>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> {reservation.email}</p>
              <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {reservation.phone}</p>
              <p style={{ margin: '5px 0' }}><strong>Rooms:</strong> {reservation.rooms.join(', ')}</p>
              <p style={{ margin: '5px 0' }}>
                <strong>Check-In:</strong> {reservation.checkIn}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Check-Out:</strong> {reservation.checkOut}
              </p>
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  onClick={() => handleEdit(reservation.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#FFC107',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(reservation.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#DC3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservationList;