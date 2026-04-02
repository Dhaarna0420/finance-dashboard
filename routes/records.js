const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth, role } = require("../middleware/auth");

// Create record
router.post("/", auth, role("admin"), (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (!amount || !type)
    return res.status(400).json({ message: "Invalid input" });

  const result = db.prepare(
    "INSERT INTO records (amount, type, category, date, notes, userId) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(amount, type, category, date, notes, req.user.id);

  res.json({ id: result.lastInsertRowid });
});

// Get records with filtering
router.get("/", auth, (req, res) => {
  const { type, category } = req.query;

  let query = "SELECT * FROM records WHERE 1=1";
  let params = [];

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  const records = db.prepare(query).all(...params);
  res.json(records);
});

// Update
router.put("/:id", auth, role("admin"), (req, res) => {
  const { amount, category } = req.body;

  db.prepare("UPDATE records SET amount=?, category=? WHERE id=?").run(
    amount,
    category,
    req.params.id
  );

  res.json({ message: "Updated" });
});

// Delete
router.delete("/:id", auth, role("admin"), (req, res) => {
  db.prepare("DELETE FROM records WHERE id=?").run(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;