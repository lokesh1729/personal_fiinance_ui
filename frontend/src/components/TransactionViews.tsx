import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

interface TransactionViewsProps {
  views: View[];
  onViewSelect: (view: View) => void;
  selectedView: View | null;
  onDeleteView: (id: number) => Promise<void>;
}

const TransactionViews: React.FC<TransactionViewsProps> = ({
  views,
  onViewSelect,
  selectedView,
  onDeleteView,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this view?')) {
      try {
        setDeletingId(id);
        await onDeleteView(id);
      } catch (error) {
        console.error('Error deleting view:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Saved Views
      </Typography>
      <List>
        {views.map((view) => (
          <ListItem
            key={view.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(view.id)}
                disabled={deletingId === view.id}
              >
                {deletingId === view.id ? (
                  <CircularProgress size={24} />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              selected={selectedView?.id === view.id}
              onClick={() => onViewSelect(view)}
            >
              <ListItemText primary={view.view_name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionViews; 