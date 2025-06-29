import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { transactionAPI } from '../services/api';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Export: React.FC = () => {
  const handleExport = () => {
    transactionAPI.exportTransactions({ columns: ['id', 'date', 'amount', 'category', 'status'] });
  };

  return (
    <Box
      sx={{
        bgcolor: '#121212',
        color: '#fff',
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
        Export Transactions
      </Typography>

      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={handleExport}
        sx={{
          mt: 2,
          backgroundColor: '#1e88e5',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        Export as CSV
      </Button>
    </Box>
  );
};

export default Export;
