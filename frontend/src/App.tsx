import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import TransactionViews from './components/TransactionViews';
import AddTransactionModal from './components/AddTransactionModal';
import SaveViewModal from './components/SaveViewModal';
import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

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

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [filters, setFilters] = useState<Filter>({
    from_date_txn_date: null,
    to_date_txn_date: null,
    account: '',
    txn_type: '',
    txn_amount: '',
    category: '',
    tags: '',
    notes: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<View | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetchViews();
  }, []);

  const fetchTransactions = async (filterParams: Partial<Filter> = {}) => {
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

  const handleFilterChange = (newFilters: Filter) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleViewSelect = (view: View) => {
    setSelectedView(view);
    const newFilters = {
      from_date_txn_date: view.from_date_txn_date ? new Date(view.from_date_txn_date) : null,
      to_date_txn_date: view.to_date_txn_date ? new Date(view.to_date_txn_date) : null,
      account: view.account || '',
      txn_type: view.txn_type || '',
      txn_amount: view.txn_amount?.toString() || '',
      category: view.category || '',
      tags: view.tags || '',
      notes: view.notes || '',
    };
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleSaveView = () => {
    setIsSaveViewModalOpen(true);
  };

  const handleDeleteView = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/views/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete view');
      }
      // Refresh the views list
      await fetchViews();
      // Clear selected view if it was deleted
      if (selectedView?.id === id) {
        setSelectedView(null);
        setFilters({
          from_date_txn_date: null,
          to_date_txn_date: null,
          account: '',
          txn_type: '',
          txn_amount: '',
          category: '',
          tags: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error deleting view:', error);
      throw error;
    }
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
              onSaveView={handleSaveView}
            />
            <TransactionTable
              transactions={transactions}
              onUpdate={fetchTransactions}
              onDelete={fetchTransactions}
              filters={filters}
            />
          </Box>
          
          <TransactionViews
            views={views}
            onViewSelect={handleViewSelect}
            selectedView={selectedView}
            onDeleteView={handleDeleteView}
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
          filters={filters}
        />
      </Box>
    </Container>
  );
}

export default App;