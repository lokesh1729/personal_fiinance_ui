import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddTransactionModal from './AddTransactionModal';
import { format } from 'date-fns';

interface Transaction {
  id: number;
  txn_date: string;
  account: string;
  txn_type: string;
  txn_amount: number;
  category: string;
  tags: string;
  notes: string;
  formatted_date?: string;
}

interface TransactionTableProps {
  filters?: {
    from_date_txn_date: Date | null;
    to_date_txn_date: Date | null;
    account: string;
    txn_type: string;
    txn_amount: string;
    category: string;
    tags: string;
    notes: string;
  };
}

const TransactionTable: React.FC<TransactionTableProps> = ({ filters }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async (filterParams?: typeof filters) => {
    try {
      setLoading(true);
      let url = 'http://localhost:3002/api/transactions';
      
      if (filterParams) {
        const queryParams = new URLSearchParams();
        if (filterParams.from_date_txn_date) {
          queryParams.append('fromDate', format(filterParams.from_date_txn_date, 'yyyy-MM-dd'));
        }
        if (filterParams.to_date_txn_date) {
          queryParams.append('toDate', format(filterParams.to_date_txn_date, 'yyyy-MM-dd'));
        }
        if (filterParams.account) queryParams.append('account', filterParams.account);
        if (filterParams.txn_type) queryParams.append('txnType', filterParams.txn_type);
        if (filterParams.txn_amount) queryParams.append('txnAmount', filterParams.txn_amount);
        if (filterParams.category) queryParams.append('category', filterParams.category);
        if (filterParams.tags) queryParams.append('tags', filterParams.tags);
        if (filterParams.notes) queryParams.append('notes', filterParams.notes);
        
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      // Pre-process the dates
      const processedData = data.map((transaction: Transaction) => ({
        ...transaction,
        formatted_date: transaction.txn_date ? format(new Date(transaction.txn_date), 'yyyy-MM-dd') : ''
      }));
      console.log('Processed transactions:', processedData);
      setTransactions(processedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filters);
  }, [filters]);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`http://localhost:3002/api/transactions/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete transaction');
        }
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'formatted_date', 
      headerName: 'Date', 
      width: 120 
    },
    { field: 'account', headerName: 'Account', width: 150 },
    { field: 'txn_type', headerName: 'Type', width: 100 },
    { field: 'txn_amount', headerName: 'Amount', width: 120 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'tags', headerName: 'Tags', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Box>
      <AddTransactionModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedTransaction(null);
        }}
        onSuccess={() => {
          fetchTransactions(filters);
          setOpenModal(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default TransactionTable; 