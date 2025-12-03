const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    http.createServer(app).listen(PORT, () => {
      console.log(`✓ API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
