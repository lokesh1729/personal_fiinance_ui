import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import TransactionViews from './components/TransactionViews';
import AddTransactionModal from './components/AddTransactionModal';
import SaveViewModal from './components/SaveViewModal';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

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

interface View {
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

interface Filters {
  fromDate: string | null;
  toDate: string | null;
  account: string;
  txnType: string;
  txnAmount: string;
  category: string;
  tags: string;
  notes: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [filters, setFilters] = useState<Filters>({
    fromDate: null,
    toDate: null,
    account: '',
    txnType: '',
    txnAmount: '',
    category: '',
    tags: '',
    notes: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<View | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchViews();
  }, []);

  const fetchTransactions = async (filterParams: Partial<Filters> = {}) => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, { params: filterParams });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchViews = async () => {
    try {
      const response = await axios.get(`${API_URL}/views`);
      setViews(response.data);
    } catch (error) {
      console.error('Error fetching views:', error);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleViewSelect = (view: View) => {
    setSelectedView(view);
    setFilters({
      fromDate: view.from_date_txn_date,
      toDate: view.to_date_txn_date,
      account: view.account || '',
      txnType: view.txn_type || '',
      txnAmount: view.txn_amount?.toString() || '',
      category: view.category || '',
      tags: view.tags || '',
      notes: view.notes || ''
    });
    fetchTransactions({
      fromDate: view.from_date_txn_date,
      toDate: view.to_date_txn_date,
      account: view.account || '',
      txnType: view.txn_type || '',
      txnAmount: view.txn_amount?.toString() || '',
      category: view.category || '',
      tags: view.tags || '',
      notes: view.notes || ''
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Transactions Management
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Transaction
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TransactionFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSaveView={() => setIsSaveViewModalOpen(true)}
            />
            <TransactionTable
              transactions={transactions}
              onUpdate={fetchTransactions}
              onDelete={fetchTransactions}
            />
          </Box>
          
          <TransactionViews
            views={views}
            onViewSelect={handleViewSelect}
            selectedView={selectedView}
          />
        </Box>

        <AddTransactionModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchTransactions();
          }}
        />

        <SaveViewModal
          open={isSaveViewModalOpen}
          onClose={() => setIsSaveViewModalOpen(false)}
          onSave={async (viewName: string) => {
            try {
              await axios.post(`${API_URL}/views`, {
                view_name: viewName,
                ...filters
              });
              fetchViews();
              setIsSaveViewModalOpen(false);
            } catch (error) {
              console.error('Error saving view:', error);
            }
          }}
        />
      </Box>
    </Container>
  );
}

export default App;