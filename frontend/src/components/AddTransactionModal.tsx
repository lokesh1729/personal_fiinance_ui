import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';

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

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  transaction,
}) => {
  const [formData, setFormData] = useState({
    txn_date: new Date(),
    account: '',
    txn_type: '',
    txn_amount: '',
    category: '',
    tags: '',
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        txn_date: new Date(transaction.txn_date),
        account: transaction.account,
        txn_type: transaction.txn_type,
        txn_amount: transaction.txn_amount.toString(),
        category: transaction.category,
        tags: transaction.tags,
        notes: transaction.notes,
      });
    } else {
      setFormData({
        txn_date: new Date(),
        account: '',
        txn_type: '',
        txn_amount: '',
        category: '',
        tags: '',
        notes: '',
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = transaction
        ? `http://localhost:3002/api/transactions/${transaction.id}`
        : 'http://localhost:3002/api/transactions';
      const method = transaction ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          txn_amount: parseFloat(formData.txn_amount),
          txn_date: formData.txn_date.toISOString(),
          account: formData.account || null,
          txn_type: formData.txn_type || null,
          category: formData.category || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      onSuccess();
      toast.success(transaction ? 'Transaction updated successfully' : 'Transaction added successfully');
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.txn_date}
                onChange={(date) => setFormData({ ...formData, txn_date: date || new Date() })}
              />
            </LocalizationProvider>
            <TextField
              label="Account"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Type"
              value={formData.txn_type}
              onChange={(e) => setFormData({ ...formData, txn_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </TextField>
            <TextField
              label="Amount"
              type="number"
              value={formData.txn_amount}
              onChange={(e) => setFormData({ ...formData, txn_amount: e.target.value })}
              fullWidth
            />
            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              fullWidth
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {transaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionModal; 