const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors()); // fix for production

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
