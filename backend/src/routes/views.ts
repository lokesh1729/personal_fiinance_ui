import express, { Request, Response } from 'express';
import pool from '../db';

const router = express.Router();

interface TransactionView {
  id: number;
  view_name: string;
  from_date_txn_date: string | null;
  to_date_txn_date: string | null;
  account: string | null;
  txn_type: string | null;
  txn_amount: number | null;
  category: string | null;
  tags: string | null;
  notes: string | null;
}

// Get all views
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM transaction_views ORDER BY view_name';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save a new view or update existing
router.post('/', async (req: Request<{}, {}, TransactionView>, res: Response) => {
  try {
    const {
      view_name,
      from_date_txn_date,
      to_date_txn_date,
      account,
      txn_type,
      txn_amount,
      category,
      tags,
      notes
    } = req.body;

    // Convert empty strings to null
    const processValue = (value: any) => {
      if (value === '' || value === undefined) return null;
      return value;
    };

    // Check if view already exists
    const checkQuery = 'SELECT id FROM transaction_views WHERE view_name = $1';
    const checkResult = await pool.query(checkQuery, [view_name]);

    let query: string;
    let values: (string | number | null)[];

    if (checkResult.rows.length > 0) {
      // Update existing view
      query = `
        UPDATE transaction_views
        SET from_date_txn_date = $1,
            to_date_txn_date = $2,
            account = $3,
            txn_type = $4,
            txn_amount = $5,
            category = $6,
            tags = $7,
            notes = $8
        WHERE view_name = $9
        RETURNING *
      `;
      values = [
        processValue(from_date_txn_date),
        processValue(to_date_txn_date),
        processValue(account),
        processValue(txn_type),
        processValue(txn_amount),
        processValue(category),
        processValue(tags),
        processValue(notes),
        view_name
      ];
    } else {
      // Insert new view
      query = `
        INSERT INTO transaction_views (
          view_name,
          from_date_txn_date,
          to_date_txn_date,
          account,
          txn_type,
          txn_amount,
          category,
          tags,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      values = [
        view_name,
        processValue(from_date_txn_date),
        processValue(to_date_txn_date),
        processValue(account),
        processValue(txn_type),
        processValue(txn_amount),
        processValue(category),
        processValue(tags),
        processValue(notes)
      ];
    }

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a view
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM transaction_views WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'View not found' });
    }

    res.json({ message: 'View deleted successfully' });
  } catch (error) {
    console.error('Error deleting view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 