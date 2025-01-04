import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { User } from '../../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

// Validation schema - same as in SignUp
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[A-Za-z\s-]+$/,
      'First name can only contain letters, spaces, and hyphens',
    ),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[A-Za-z\s-]+$/,
      'Last name can only contain letters, spaces, and hyphens',
    ),

  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
});

export function UpdateUserModal({
  open,
  onClose,
  onUpdate,
  user,
}: UpdateUserModalProps) {
  const [serverError, setServerError] = React.useState('');

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    validationSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setServerError('');
      try {
        await onUpdate(values);
        onClose();
      } catch (error: any) {
        setServerError(error.response?.data?.message || 'Update failed');
        console.error('Update error:', error);
      }
    },
  });

  const isUpdateDisabled =
    formik.isSubmitting ||
    (Object.keys(formik.touched).length > 0 && !formik.isValid);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        formik.resetForm();
      }}
    >
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        {serverError && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {serverError}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          fullWidth
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => formik.handleSubmit()}
          disabled={isUpdateDisabled}
        >
          {formik.isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
