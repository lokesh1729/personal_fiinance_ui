import express, { Request, Response } from 'express';
import pool from '../db';

const router = express.Router();

interface Transaction {
  id: number;
  txn_date: string;
  account: string;
  txn_type: string;
  txn_amount: number;
  category: string;
  tags: string;
  notes: string;
}

interface TransactionQueryParams {
  fromDate?: string;
  toDate?: string;
  account?: string;
  txnType?: string;
  txnAmount?: string;
  category?: string;
  tags?: string;
  notes?: string;
}

// Get all transactions with filters
router.get('/', async (req: Request<{}, {}, {}, TransactionQueryParams>, res: Response) => {
  try {
    const {
      fromDate,
      toDate,
      account,
      txnType,
      txnAmount,
      category,
      tags,
      notes
    } = req.query;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (fromDate) {
      query += ` AND txn_date >= $${paramCount}`;
      values.push(fromDate);
      paramCount++;
    }

    if (toDate) {
      query += ` AND txn_date <= $${paramCount}`;
      values.push(toDate);
      paramCount++;
    }

    if (account) {
      query += ` AND account = $${paramCount}`;
      values.push(account);
      paramCount++;
    }

    if (txnType) {
      query += ` AND txn_type = $${paramCount}`;
      values.push(txnType);
      paramCount++;
    }

    if (txnAmount) {
      query += ` AND txn_amount = $${paramCount}`;
      values.push(parseFloat(txnAmount));
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (tags) {
      query += ` AND tags ILIKE $${paramCount}`;
      values.push(`%${tags}%`);
      paramCount++;
    }

    if (notes) {
      query += ` AND notes ILIKE $${paramCount}`;
      values.push(`%${notes}%`);
      paramCount++;
    }

    query += ' ORDER BY txn_date DESC';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new transaction
router.post('/', async (req: Request<{}, {}, Transaction>, res: Response) => {
  try {
    const {
      txn_date,
      account,
      txn_type,
      txn_amount,
      category,
      tags,
      notes
    } = req.body;

    const query = `
      INSERT INTO transactions (txn_date, account, txn_type, txn_amount, category, tags, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [txn_date, account, txn_type, txn_amount, category, tags, notes];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a transaction
router.put('/:id', async (req: Request<{ id: string }, {}, Transaction>, res: Response) => {
  try {
    const { id } = req.params;
    const {
      txn_date,
      account,
      txn_type,
      txn_amount,
      category,
      tags,
      notes
    } = req.body;

    const query = `
      UPDATE transactions
      SET txn_date = $1,
          account = $2,
          txn_type = $3,
          txn_amount = $4,
          category = $5,
          tags = $6,
          notes = $7
      WHERE id = $8
      RETURNING *
    `;

    const values = [txn_date, account, txn_type, txn_amount, category, tags, notes, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a transaction
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 