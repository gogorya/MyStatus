const express = require("express");
const cors = require("cors");
const { requireAuth } = require("@clerk/express");
const monitorRoutes = require("./routes/monitorRoutes");
const statusPageRoutes = require("./routes/statusPageRoutes");
const connectDB = require("./config/database");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors()); // fix for production

app.use("/api/monitors", requireAuth(), monitorRoutes);
app.use("/api/status-pages", requireAuth(), statusPageRoutes);

connectDB();

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
