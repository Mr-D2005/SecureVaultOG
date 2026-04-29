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

// --- CRITICAL MIDDLEWARE (TOP PRIORITY) ---
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

// --- AWS CONNECTIVITY PROBE ---
app.get('/api/health/aws', async (req, res) => {
  const diagnostics = { rds: 'PENDING', s3: 'PENDING', kms: 'PENDING', env: {} };
  
  // Check Env Vars (Masked)
  diagnostics.env = {
    AWS_REGION: process.env.AWS_REGION || 'NOT_SET',
    HAS_ACCESS_KEY: !!process.env.AWS_ACCESS_KEY_ID,
    HAS_SECRET_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.AWS_S3_BUCKET || 'secvaults3'
  };

  try {
    const { sequelize } = require('./models/index');
    await sequelize.authenticate();
    diagnostics.rds = 'CONNECTED';
  } catch (e) {
    diagnostics.rds = `FAILED: ${e.message}`;
  }

  try {
    const { sequelize } = require('./models/index');
    await sequelize.authenticate();
    // Test Write: Create a temporary diagnostic entry
    // (Assuming there is a table we can write to, like ThreatScan)
    diagnostics.rds = 'CONNECTED (READ_ONLY)';
    const { ThreatScan } = require('./models/index');
    const testEntry = await ThreatScan.create({ 
      targetUrl: 'DIAGNOSTIC_PROBE', 
      hostname: 'internal',
      logs: ['PERM_TEST']
    });
    await testEntry.destroy();
    diagnostics.rds = 'CONNECTED (READ_WRITE)';
  } catch (e) {
    diagnostics.rds = `RDS_FAIL: ${e.message}`;
  }

  try {
    const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({ 
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    const bucket = process.env.AWS_S3_BUCKET || 'secvaults3';
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: 'DIAG_TEST', Body: 'PROBE' }));
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: 'DIAG_TEST' }));
    diagnostics.s3 = 'REACHABLE (READ_WRITE)';
  } catch (e) {
    diagnostics.s3 = `S3_FAIL: ${e.message}`;
  }


  res.json(diagnostics);
});



// --- CATCH-ALL ROUTE ---
// All other requests should serve the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- [SECUREVAULT NODE ONLINE: PORT ${PORT}] ---`);
  });
};

startServer();

