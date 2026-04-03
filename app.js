const express = require("express");
const app = express();
const db = require("./db");
const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const dashboardRoutes = require("./routes/dashboard");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(3000, () => console.log("Server running on port 3000"));