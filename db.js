const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://mehul:mehul123@cluster0.vhughsu.mongodb.net/realTimeChat');
    console.log('Database Connected!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
