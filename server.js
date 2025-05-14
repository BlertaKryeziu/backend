const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importimi i rrugve
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');

const adminTable = require("./routes/adminTable");

const adminFoods = require("./routes/adminFoods");

// perdorimi i rrugve 
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

app.use('/api/adminTable', adminTable);
app.use('api/adminFoods', adminFoods);


// Test endpoint
app.get('/', (req, res) => {
  res.send('Backend is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
