import db from '../db/index.js';

export const getSummary = (req, res, next) => {
  try {
    const totals = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      FROM financial_records
    `).get();

    const categorySummary = db.prepare(`
      SELECT category, type, SUM(amount) as total 
      FROM financial_records 
      GROUP BY category, type
    `).all();

    const netBalance = (totals.total_income || 0) - (totals.total_expenses || 0);

    res.json({
      summary: {
        total_income: totals.total_income || 0,
        total_expenses: totals.total_expenses || 0,
        net_balance: netBalance
      },
      categories: categorySummary
    });
  } catch (err) {
    next(err);
  }
};

export const getTrends = (req, res, next) => {
  try {
    const trends = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        type,
        SUM(amount) as total
      FROM financial_records
      GROUP BY month, type
      ORDER BY month ASC
    `).all();

    res.json(trends);
  } catch (err) {
    next(err);
  }
};
