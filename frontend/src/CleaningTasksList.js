// frontend/src/CleaningTasksList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CleaningTasksList() {
  const [tasks, setTasks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [expandedReservation, setExpandedReservation] = useState(null);

  // Fetch cleaning tasks and reservations when component mounts
  useEffect(() => {
    axios.get('http://localhost:5001/api/cleaning-schedule')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching cleaning tasks:', error));

    axios.get('http://localhost:5001/api/reservations')
      .then(response => setReservations(response.data))
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  // Merge each cleaning task with its corresponding reservation details
  const mergedTasks = tasks.map(task => {
    const reservation = reservations.find(r => r.id === Number(task.reservationId));
    return { ...task, reservation };
  });

  // Group tasks by reservationId
  const groupedByReservation = mergedTasks.reduce((groups, task) => {
    const resId = task.reservationId;
    if (!groups[resId]) {
      groups[resId] = [];
    }
    groups[resId].push(task);
    return groups;
  }, {});

  // Sort reservation groups by the check-out date of the first task in each group
  const sortedReservationIds = Object.keys(groupedByReservation).sort((a, b) => {
    const dateA = new Date(groupedByReservation[a][0].cleaningDate);
    const dateB = new Date(groupedByReservation[b][0].cleaningDate);
    return dateA - dateB;
  });

  // Toggle expanded view for a reservation group
  const toggleExpanded = (resId) => {
    setExpandedReservation(prev => (prev === resId ? null : resId));
  };

  // Handler to mark a specific cleaning task as cleaned
  const markTaskCleaned = (taskId) => {
    axios.put(`http://localhost:5001/api/cleaning-schedule/task/${taskId}`, { completed: true })
      .then(response => {
        alert(response.data.message);
        // Refresh tasks after updating
        axios.get('http://localhost:5001/api/cleaning-schedule')
          .then(resp => setTasks(resp.data))
          .catch(err => console.error('Error refreshing tasks:', err));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Cleaning Tasks</h2>
      {sortedReservationIds.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No cleaning tasks found.</p>
      ) : (
        sortedReservationIds.map(resId => {
          const tasksForRes = groupedByReservation[resId];
          const reservation = tasksForRes[0].reservation;
          return (
            <div key={resId} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              {/* Reservation summary header */}
              <div onClick={() => toggleExpanded(resId)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0', color: '#007BFF' }}>
                    {reservation ? reservation.customerName : 'Unknown Reservation'}
                  </h3>
                  {reservation && (
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#555' }}>
                      {reservation.email} | {reservation.phone}
                    </p>
                  )}
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555' }}>
                    Check-Out: {tasksForRes[0].cleaningDate} 11:00 AM
                  </p>
                </div>
                <div style={{ fontSize: '18px', color: '#007BFF' }}>
                  {expandedReservation === resId ? '▲' : '▼'}
                </div>
              </div>
              {/* Expanded list of tasks */}
              {expandedReservation === resId && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontWeight: 'bold' }}>Rooms to Clean:</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tasksForRes.map(task => (
                      <li key={task.taskId} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '15px' }}>
                          Room {task.room} - {task.completed ? 'Cleaned' : 'Pending'}
                        </span>
                        {!task.completed && (
                          <button 
                            onClick={() => markTaskCleaned(task.taskId)}
                            style={{ padding: '6px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                          >
                            Mark as Cleaned
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default CleaningTasksList;