import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import { DashboardAnalytics } from '../types';
import {
  Typography,
  Grid,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const theme = useTheme();

  useEffect(() => {
    transactionAPI.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const cardStyles = {
    backgroundColor: '#1e1e2f',
    color: '#ffffff',
    borderRadius: 2,
    p: 2,
    textAlign: 'center' as const,
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
  };

  const chartContainerStyles = {
    backgroundColor: '#1e1e2f',
    color: '#ffffff',
    borderRadius: 2,
    p: 2,
    mt: 4,
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {analytics && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={cardStyles}>Balance<br />₹{analytics.summary.totalRevenue}</Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={cardStyles}>Revenue<br />₹{analytics.summary.totalRevenue}</Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={cardStyles}>Expenses<br />₹{analytics.summary.totalExpenses}</Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={cardStyles}>Savings<br />₹{analytics.summary.netProfit}</Paper>
            </Grid>
          </Grid>

          <Paper sx={chartContainerStyles}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analytics.monthlyTrends.reduce((acc, cur) => {
                  const key = `${cur._id.month}/${cur._id.year}`;
                  const existing = acc.find(a => a.name === key);
                  if (existing) {
                    existing[cur._id.category] = cur.total;
                  } else {
                    acc.push({ name: key, [cur._id.category]: cur.total });
                  }
                  return acc;
                }, [] as any[])}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="Revenue" stroke="#00FF94" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Expense" stroke="#FFBB00" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
