const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const port = process.env.PORT || 8080; 


app.use(cors({
  origin: "https://purple-hill-0b21af903.2.azurestaticapps.net", // URL Front
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }, 
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// ROUTES API
app.get("/api/status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS status");
    res.json({ success: true, database: "Connected", status: rows[0].status });
  } catch (error) {
    res.status(500).json({ success: false, error: "Database unreachable: " + error.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { firstname } = req.body;
  if (!firstname) return res.status(400).json({ success: false, error: "Firstname requis" });

  try {
    const [result] = await pool.query("INSERT INTO users(firstname) VALUES (?)", [firstname]);
    res.status(201).json({ success: true, id: result.insertId, firstname });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, firstname, created_at FROM users ORDER BY id DESC");
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur Azure démarré sur le port ${port}`);
});