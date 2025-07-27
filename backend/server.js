const express = require("express");
const cors = require("cors");
require("dotenv").config(); // .env fájl betöltése a legelején

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
