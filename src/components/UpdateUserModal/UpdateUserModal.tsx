import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { User } from '../../services/api';

interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (formData: UpdateFormData) => Promise<void>;
  user: User | null;
}

export interface UpdateFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export function UpdateUserModal({
  open,
  onClose,
  onUpdate,
  user,
}: UpdateUserModalProps) {
  const [formData, setFormData] = useState<UpdateFormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    await onUpdate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          fullWidth
          value={formData.firstName}
          onChange={(e) =>
            setFormData({
              ...formData,
              firstName: e.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          value={formData.lastName}
          onChange={(e) =>
            setFormData({
              ...formData,
              lastName: e.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
