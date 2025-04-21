import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ACCOUNT_OPTIONS = [
  'HDFC Bank Account',
  'Kotak Bank Account',
  'Equitas Bank Account',
  'Cash',
  'HDFC Credit Card',
  'Kotak Credit Card',
  'SBI Credit Card',
  'ICICI Credit Card',
  'Others',
  'Amazon Pay',
  'IDFC First Bank Account',
  'Fi Bank Account',
  'SBI Bank Account',
  'Freecharge',
  'Paytm Wallet',
  'Paytm Food Wallet',
  'Ola Money Postpaid',
  'Simpl',
  'IndusInd Credit Card',
  'Slice Credit Card',
  'DBS Bank Account',
  'Citi Bank Account'
];

const TXN_TYPE_OPTIONS = ['Credit', 'Debit', 'Others'];

const CATEGORY_OPTIONS = [
  'Salary',
  'Refund',
  'Cashback',
  'Investment Redemption',
  'Investments',
  'Loan',
  'Rent',
  'Bills',
  'Groceries',
  'Fruits & Vegetables',
  'Food & Dining',
  'Egg & Meat',
  'Household',
  'Health',
  'Personal Care',
  'Shopping',
  'Life Style',
  'Maintenance',
  'Fuel',
  'Travel',
  'Gifts',
  'Productivity',
  'Entertainment',
  'Donation',
  'ATM Withdrawal',
  'Ramya',
  'Misc',
  'Others'
];

interface Filter {
  from_date_txn_date: Date | null;
  to_date_txn_date: Date | null;
  account: string;
  txn_type: string;
  txn_amount: string;
  category: string;
  tags: string;
  notes: string;
}

interface TransactionFiltersProps {
  filters: {
    from_date_txn_date: Date | null;
    to_date_txn_date: Date | null;
    account: string;
    txn_type: string;
    txn_amount: string;
    category: string;
    tags: string;
    notes: string;
  };
  onFilterChange: (filters: Filter) => void;
  onSaveView: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, onFilterChange, onSaveView }) => {
  const [localFilters, setLocalFilters] = useState<Filter>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field: keyof Filter, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      from_date_txn_date: null,
      to_date_txn_date: null,
      account: '',
      txn_type: '',
      txn_amount: '',
      category: '',
      tags: '',
      notes: '',
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasFiltersChanged = () => {
    return Object.values(localFilters).some(value => value !== '' && value !== null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="From Date"
              value={localFilters.from_date_txn_date}
              onChange={(date) => handleFilterChange('from_date_txn_date', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="To Date"
              value={localFilters.to_date_txn_date}
              onChange={(date) => handleFilterChange('to_date_txn_date', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Account"
              value={localFilters.account}
              onChange={(e) => handleFilterChange('account', e.target.value)}
            >
              {ACCOUNT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Type"
              value={localFilters.txn_type}
              onChange={(e) => handleFilterChange('txn_type', e.target.value)}
            >
              {TXN_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Amount"
              value={localFilters.txn_amount}
              onChange={(e) => handleFilterChange('txn_amount', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Tags"
              value={localFilters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Notes"
              value={localFilters.notes}
              onChange={(e) => handleFilterChange('notes', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                disabled={!hasFiltersChanged()}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
                disabled={!hasFiltersChanged()}
              >
                Apply Filters
              </Button>
              {hasFiltersChanged() && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onSaveView}
                >
                  Save as View
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default TransactionFilters; 