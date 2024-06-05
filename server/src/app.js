const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const { logger } = require("../Logs/logs.js");
const multer = require("multer");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "DELETE", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    frameguard: { action: "deny" }, // X-Frame-Options: DENY
    xssFilter: true, // X-XSS-Protection: 1; mode=block
    noSniff: true, // X-Content-Type-Options: nosniff
  })
);
app.disable("x-powered-by");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Endpoint to upload files
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Handle the uploaded file
    res.json({ message: "File uploaded successfully!" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//simple ping endpoint to check if connection is alive
app.get("/ping", (req, res) => {
  try {
    //pong the ping lol
    res.status(200).json({ message: "pong" });
    res.end();
  } catch (error) {
    logger.error(error);
    res.statusCode(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware || if endpoint is not found
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
