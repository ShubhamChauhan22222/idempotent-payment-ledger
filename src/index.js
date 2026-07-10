const express = require('express');
const connectDB = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
connectDB();

// API Routes
app.use('/api/v1', routes);

// Central error handling
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`[Server] Ledger API listening on port ${PORT}`);
});
