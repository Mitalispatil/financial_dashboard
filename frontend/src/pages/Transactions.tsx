import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import { Transaction } from '../types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';

const Transactions: React.FC = () => {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    transactionAPI.getTransactions().then((data) => {
      setRows(data.transactions);
    }).finally(() => setLoading(false));
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      renderCell: (params) => (
        <span style={{ color: params.row.category === 'Revenue' ? '#4caf50' : '#f44336' }}>
          ₹{params.value}
        </span>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === 'Revenue' ? '#4caf50' : '#f44336' }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === 'Paid' ? '#00e676' : '#ff9100' }}>
          {params.value}
        </span>
      )
    },
  ];

  return (
    <Box sx={{ bgcolor: '#121212', p: 3, minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
        Transactions
      </Typography>
      <Box
        sx={{
          '& .MuiDataGrid-root': {
            backgroundColor: '#1e1e1e',
            color: '#ccc',
            border: '1px solid #333',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#2c2c2e',
            color: '#fff',
            borderBottom: '1px solid #444',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #333',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#1e1e1e',
            borderTop: '1px solid #444',
            color: '#ccc',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
