require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Allow dev frontends to call API

// API routes
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Static serving only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
