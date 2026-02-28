const { timeStamp } = require('console');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;//portul pe care va rula serverul
const connectDB = require('./config/db');
const tasksRouter = require('./routes/tasks');
const { router: authRouter } = require('./routes/auth');

connectDB();
app.use(cors());//permite orice domeniu sa faca cereri la backend

app.use(express.json());
// if the frontend is served from the same origin we don't need an API_URL
// constant; leaving it blank causes the client to use relative paths (/api/...)
// set API_URL only when the frontend is hosted separately.
const API_URL = process.env.API_URL ? process.env.API_URL.replace(/\/+$/,'') : '';

// expose a minimal API root JSON at /api; the UI lives at /
app.get('/api', (req, res) => {
    res.json({
        message: 'task manager api',
        status: 'ok',
        timeStamp: new Date(),
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            tasks: '/api/tasks',
            health: '/api/health'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running',
        uptime: process.uptime()
    });
});
app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);

// serve frontend static files; check both possible locations so
// deployment platforms that change the build context still work.
let frontendPath = path.join(__dirname, '..', 'frontend');
if (!require('fs').existsSync(frontendPath)) {
    const alt = path.join(__dirname, 'frontend');
    if (require('fs').existsSync(alt)) {
        frontendPath = alt;
    }
}
console.log('Serving static files from', frontendPath);
app.use(express.static(frontendPath));

// expose a small JS snippet that sets a global variable for the frontend
app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    // API_URL might be set via environment when the container is started
    res.send(`window.API_URL = "${API_URL}";`);
});

// fallback to index.html for any non-API route (supports direct navigation)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: /api/health`);
  console.log(`Tasks API: /api/tasks`);
  console.log(`Auth API: /api/auth`);
});
