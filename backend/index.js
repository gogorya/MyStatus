// Imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Routes
const routes = require("./routes/index");

// Others
const { connectDB } = require("./config/database");
const startJobs = require("./jobs/index");

require("dotenv").config();

// Configure Express app
const app = express();

app.use(express.json());
// Temp middleware to check req
app.use((req, res, next) => {
  console.log("Headers:", Object.keys(req.headers));
  console.log("Auth Header:", req.headers.authorization);
  next();
});
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:3000" }));
app.use(helmet());
app.use(routes);

// Database config and jobs
connectDB();
startJobs();

// Start the server and listen for requests
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
