const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your Next.js frontend URL
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
  }));
app.use(express.json());

const bookings = []; // Simple in-memory storage for bookings

// Endpoint: Get bookings for a specific date
app.get('/api/bookings', (req, res) => {
  const { date } = req.query;
  const bookedSlots = bookings.filter((b) => b.date === date).map((b) => b.time);
  const allSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
  res.json({ availableSlots });
});

// Endpoint: Create a booking
app.post('/api/bookings', (req, res) => {
  const { name, contact, date, time, guests } = req.body;

  // Validate fields
  if (!name || !contact || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Check for double booking
  if (bookings.find((b) => b.date === date && b.time === time)) {
    return res.status(400).json({ success: false, message: 'Slot already booked' });
  }

  const newBooking = { name, contact, date, time, guests };
  bookings.push(newBooking);
  res.json({ success: true, booking: newBooking });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});