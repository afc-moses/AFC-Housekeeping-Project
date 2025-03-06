// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// --- Example API Endpoints ---

// Default route to check if the backend is running
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// In-memory storage for reservations and cleaning schedule
let reservations = [];
let cleaningSchedule = [];
let nextTaskId = 1;

// Endpoint to get all reservations
app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

// Endpoint to add a reservation and update the cleaning schedule
app.post('/api/reservations', (req, res) => {
  const reservation = req.body;
  // Assign a unique ID to the reservation
  reservation.id = Date.now();
  reservations.push(reservation);

  // For each room selected, add a cleaning schedule entry on the check-out date.
  if (reservation.rooms && reservation.checkOut) {
    reservation.rooms.forEach(room => {
      cleaningSchedule.push({
        taskId: nextTaskId++,
        room,
        cleaningDate: reservation.checkOut,
        reservationId: reservation.id,
        completed: false
      });
    });
  }

  res.json({ message: 'Reservation added successfully!', reservation });
});

// Endpoint to update (edit) a reservation by ID
app.put('/api/reservations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = reservations.findIndex(r => r.id === id);
  if (index !== -1) {
    const updatedReservation = req.body;
    updatedReservation.id = id; // Keep the same ID
    reservations[index] = updatedReservation;

    // Update cleaning schedule: remove old tasks and add new ones
    cleaningSchedule = cleaningSchedule.filter(task => task.reservationId !== id);
    if (updatedReservation.rooms && updatedReservation.checkOut) {
      updatedReservation.rooms.forEach(room => {
        cleaningSchedule.push({
          taskId: nextTaskId++,
          room,
          cleaningDate: updatedReservation.checkOut,
          reservationId: id,
          completed: false
        });
      });
    }
    res.json({ message: 'Reservation updated successfully!', reservation: updatedReservation });
  } else {
    res.status(404).json({ message: 'Reservation not found' });
  }
});

// Endpoint to delete a reservation by ID
app.delete('/api/reservations/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = reservations.findIndex(r => r.id === id);
  if (index !== -1) {
    reservations.splice(index, 1);
    cleaningSchedule = cleaningSchedule.filter(task => task.reservationId !== id);
    res.json({ message: 'Reservation deleted successfully!' });
  } else {
    res.status(404).json({ message: 'Reservation not found' });
  }
});

// Endpoint to update a cleaning task's status (mark as completed)
app.put('/api/cleaning-schedule/task/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const index = cleaningSchedule.findIndex(task => task.taskId === taskId);
  if (index !== -1) {
    cleaningSchedule[index].completed = req.body.completed;
    res.json({ message: 'Task updated successfully!', task: cleaningSchedule[index] });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Endpoint to get cleaning schedule data
app.get('/api/cleaning-schedule', (req, res) => {
  res.json(cleaningSchedule);
});

// --- End of API Endpoints ---

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler: For any request that doesn't match an API route,
// send back the React app's index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server after all routes are set up
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});