import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

// Import routes
import transactionsRouter from './routes/transactions';
import viewsRouter from './routes/views';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/views', viewsRouter);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 