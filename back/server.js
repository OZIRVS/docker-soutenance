const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const dbPassword = process.env.DB_PASSWORD_FILE
  ? fs.readFileSync(process.env.DB_PASSWORD_FILE, "utf8").trim()
  : process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/api/status", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS status");
    res.json({ success: true, database: rows[0].status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { firstname } = req.body;
  if (!firstname || typeof firstname !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "firstname is required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users(firstname) VALUES (?)",
      [firstname],
    );
    res.status(201).json({ success: true, id: result.insertId, firstname });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, firstname, created_at FROM users ORDER BY id DESC",
    );
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});
