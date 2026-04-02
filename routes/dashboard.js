const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth, role } = require("../middleware/auth");

router.get("/summary", auth, role("analyst", "admin"), (req, res) => {
  const income = db
    .prepare("SELECT SUM(amount) as total FROM records WHERE type='income'")
    .get().total || 0;

  const expense = db
    .prepare("SELECT SUM(amount) as total FROM records WHERE type='expense'")
    .get().total || 0;

  const category = db
    .prepare("SELECT category, SUM(amount) as total FROM records GROUP BY category")
    .all(); 
  res.json({
    income,
    expense,
    net: income - expense,
    category
  });
});

module.exports = router;