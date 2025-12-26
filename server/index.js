const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db.js");
const routes = require("./routes/index.js");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running!!");
});

app.use("/api-v1", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "404 not found",
    message: "Route not found",
  });
});

const server = () => {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

server();
