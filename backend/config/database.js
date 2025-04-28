const mongoose = require("mongoose");
const Agenda = require("agenda");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

const initializeAgenda = () => {
  const agenda = new Agenda({
    db: { address: process.env.MONGODB_URI },
  });
  return agenda;
};

module.exports = { connectDB, initializeAgenda };
