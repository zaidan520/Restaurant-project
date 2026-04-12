const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', process.env.MONGO_URI.replace(/HAQANIA11%40/, 'HAQANIA11***')); // Hide password in logs
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test creating a collection
    const testSchema = new mongoose.Schema({ test: String });
    const Test = mongoose.model('Test', testSchema);
    await Test.create({ test: 'connection works' });
    console.log('✅ Database write successful!');
    
    await mongoose.disconnect();
    console.log('✅ Test complete');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Full error:', err);
  }
};

testConnection();