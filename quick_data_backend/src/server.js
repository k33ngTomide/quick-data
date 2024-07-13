const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const initializeAdmin = require('./config/initAdmin');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

// Connect Database
connectDB().then(() => {
    // Initialize Admin
    initializeAdmin();
});

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/data', require('./routes/data'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
