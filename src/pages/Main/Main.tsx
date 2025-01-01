import React, { useEffect, useState, useCallback } from 'react';
import { usersApi, User } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { authApi } from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  UpdateUserModal,
  UpdateFormData,
} from '../../components/UpdateUserModal';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

function Main() {
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || '',
  );

  // Get pagination params from URL or use defaults
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setSearchParams({ page: '1', limit: limit.toString(), search });
    }, 500),
    [],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getAll({
          page,
          limit,
          search: searchParams.get('search') || '',
        });
        setUsers(data.items);
        setTotalUsers(data.total);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, searchParams]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
    } catch (error) {
      setError('Failed to logout');
    }
  };

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (formData: UpdateFormData) => {
    if (!selectedUser) return;

    try {
      await usersApi.update(selectedUser.id, formData);
      const updatedUsers = await usersApi.getAll({ page, limit });
      setUsers(updatedUsers.items);
      setIsUpdateModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await usersApi.delete(selectedUser.id);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setSearchParams({ page: value.toString(), limit: limit.toString() });
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    setSearchParams({ page: '1', limit: newLimit.toString() });
  };

  const paginationControls = (
    <Box
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <FormControl variant="outlined" size="small">
        <InputLabel>Items per page</InputLabel>
        <Select
          value={limit}
          onChange={handleLimitChange}
          label="Items per page"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
      </FormControl>

      <Pagination
        count={Math.ceil(totalUsers / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Users List
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 250 }}
          />
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <Typography
                    color={user.isActive ? 'success.main' : 'error.main'}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleUpdateClick(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {paginationControls}

      <UpdateUserModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdate}
        user={selectedUser}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {selectedUser?.firstName}{' '}
            {selectedUser?.lastName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Main;
