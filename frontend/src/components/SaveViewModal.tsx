import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface SaveViewModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (viewName: string) => void;
}

const SaveViewModal: React.FC<SaveViewModalProps> = ({ open, onClose, onSave }) => {
  const [viewName, setViewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewName.trim()) {
      onSave(viewName.trim());
      setViewName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Current View</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            type="text"
            fullWidth
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaveViewModal; 