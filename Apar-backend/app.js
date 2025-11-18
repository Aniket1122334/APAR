const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/mongoose");
const authenticator = require("./middlewares/authenticator");

const app = express();

connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route Imports

//Auth
const authRoutes = require("./routes/authRoutes/authRoutes");

//Forms
const formRoutes = require("./routes/formRoutes/formRoutes");

//Views
const viewRoutes = require("./routes/viewRoutes/viewRoutes");

//Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/form", authenticator, formRoutes);
app.use("/api/view", authenticator, viewRoutes);

app.get("/", (req, res) => {
  res.send("APARS backend server is running successfully (Merged API)!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Merged API Server running on port ${PORT}`);
});
