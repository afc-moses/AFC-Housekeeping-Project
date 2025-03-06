const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Reservation Schema
const reservationSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  rooms: [String],
  checkIn: String,
  checkOut: String,
  id: Number
});
const Reservation = mongoose.model('Reservation', reservationSchema);

// Define CleaningTask Schema
const cleaningTaskSchema = new mongoose.Schema({
  taskId: Number,
  room: String,
  cleaningDate: String,
  reservationId: Number,
  completed: Boolean
});
const CleaningTask = mongoose.model('CleaningTask', cleaningTaskSchema);

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Default route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Get all reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    console.log('Fetched reservations:', reservations);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
});

// Add a reservation
app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = req.body;
    reservation.id = Date.now();
    const newReservation = new Reservation(reservation);
    await newReservation.save();
    console.log('New reservation added:', newReservation);

    if (reservation.rooms && reservation.checkOut) {
      const tasks = reservation.rooms.map(room => ({
        taskId: Date.now() + Math.floor(Math.random() * 1000), // Unique taskId
        room,
        cleaningDate: reservation.checkOut,
        reservationId: reservation.id,
        completed: false
      }));
      await CleaningTask.insertMany(tasks);
    }

    res.json({ message: 'Reservation added successfully!', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reservation', error });
  }
});

// Update a reservation
app.put('/api/reservations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedReservation = req.body;
    updatedReservation.id = id;
    const reservation = await Reservation.findOneAndUpdate({ id }, updatedReservation, { new: true });
    if (reservation) {
      await CleaningTask.deleteMany({ reservationId: id });
      if (updatedReservation.rooms && updatedReservation.checkOut) {
        const tasks = updatedReservation.rooms.map(room => ({
          taskId: Date.now() + Math.floor(Math.random() * 1000),
          room,
          cleaningDate: updatedReservation.checkOut,
          reservationId: id,
          completed: false
        }));
        await CleaningTask.insertMany(tasks);
      }
      console.log('Reservation updated:', reservation);
      res.json({ message: 'Reservation updated successfully!', reservation });
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
});

// Delete a reservation
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const reservation = await Reservation.findOneAndDelete({ id });
    if (reservation) {
      await CleaningTask.deleteMany({ reservationId: id });
      console.log('Reservation deleted, ID:', id);
      res.json({ message: 'Reservation deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation', error });
  }
});

// Update cleaning task status
app.put('/api/cleaning-schedule/task/:taskId', async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const task = await CleaningTask.findOneAndUpdate({ taskId }, { completed: req.body.completed }, { new: true });
    if (task) {
      res.json({ message: 'Task updated successfully!', task });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Get cleaning schedule
app.get('/api/cleaning-schedule', async (req, res) => {
  try {
    const schedule = await CleaningTask.find();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cleaning schedule', error });
  }
});

// Serve static files and catch-all for SPA
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});