// // ─── Database connection pool ─────────────────────────────────────────────────
// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on('error', (err) => {
//   console.error('Unexpected DB error:', err.message);
// });

// module.exports = pool;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // no options needed in Mongoose 7+
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;