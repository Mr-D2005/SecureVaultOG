const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

const { initDB } = require('./models/index');
const authRoutes = require('./routes/auth');
const encryptRoutes = require('./routes/encrypt');
const stegoRoutes = require('./routes/stego');
const statsRoutes = require('./routes/stats');
const ravanRoutes = require('./routes/ravan');
const threatRoutes = require('./routes/threat');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/encrypt', encryptRoutes);
app.use('/api/stego', stegoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ravan', ravanRoutes);
app.use('/api/threat', threatRoutes);

// --- STATIC FRONTEND SERVING ---
// Serve static files from the built React app (Vite dist folder)
app.use(express.static(path.join(__dirname, '../dist')));

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'SECUREVAULT_CORE_STABLE' });
});

// --- CATCH-ALL ROUTE ---
// All other requests should serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- [SECUREVAULT NODE ONLINE: PORT ${PORT}] ---`);
  });
};

startServer();

