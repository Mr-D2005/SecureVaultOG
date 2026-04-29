const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const sequelize = new Sequelize(
  process.env.RDS_DB_NAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 10000 // 10s timeout to prevent hanging
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 10000
    }
  }
);



// --- User Model ---
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: true },
  otpExpiry: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: true });

// --- EncryptedData Model (Audit Trail for Encrypted Messages/Files) ---
const EncryptedData = sequelize.define('EncryptedData', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: true },
  action: { type: DataTypes.STRING, allowNull: false }, // 'ENCRYPT_MESSAGE' | 'ENCRYPT_FILE'
  target: { type: DataTypes.STRING, allowNull: false }, // Name or Hash
  ciphertext: { type: DataTypes.TEXT('long'), allowNull: true }, // Encrypted payload
  sealedKey: { type: DataTypes.TEXT, allowNull: true }, // KMS-sealed AES key
  iv: { type: DataTypes.TEXT, allowNull: true }, // Init vector
  s3_url: { type: DataTypes.STRING, allowNull: true }, // Deprecated but kept for compatibility
  status: { type: DataTypes.STRING, defaultValue: 'VERIFIED' }
}, { timestamps: true });

// --- ThreatScan Model (Forensic Analysis Persistence) ---
const ThreatScan = sequelize.define('ThreatScan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  targetUrl: { type: DataTypes.STRING, allowNull: false },
  hostname: { type: DataTypes.STRING, allowNull: false },
  riskScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  isSuspicious: { type: DataTypes.BOOLEAN, defaultValue: false },
  threatReason: { type: DataTypes.STRING, allowNull: true },
  logs: { type: DataTypes.JSON, allowNull: true },
  tarpitActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  trapUrl: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

const initDB = async () => {
  try {
    await sequelize.authenticate();
    // Use sync without alter to avoid RDS 'Too many keys' constraint error
    await sequelize.sync();
    console.log('--- [IDENTITY LEDGER PULSE NOMINAL: AWS RDS LINK ACTIVE] ---');
  } catch (err) {
    console.error('--- [LEDGER LINK FAILURE: KMS_RDS_HANDSHAKE_VOID] ---', err);
    // Still start the server even if DB sync fails
  }
};

module.exports = { sequelize, User, EncryptedData, ThreatScan, initDB };
