import express, { Request, Response } from 'express';
import Transaction from '../models/transaction';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import * as csv from 'csv-writer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Get all transactions with filtering, sorting, and pagination
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      status,
      user_id,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { user_id: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // User ID filter
    if (user_id && user_id !== 'all') {
      filter.user_id = user_id;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    // Sort options
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const transactions = await Transaction.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total,
        itemsPerPage: limitNumber
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction analytics/dashboard data
router.get('/analytics', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get total revenue and expenses
    const revenueResult = await Transaction.aggregate([
      { $match: { category: 'Revenue' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseResult = await Transaction.aggregate([
      { $match: { category: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const netProfit = totalRevenue - totalExpenses;

    // Get monthly trends
    const monthlyTrends = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status breakdown
    const statusBreakdown = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(5);

    res.json({
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        totalTransactions: await Transaction.countDocuments()
      },
      monthlyTrends,
      categoryBreakdown,
      statusBreakdown,
      recentTransactions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export transactions as CSV
router.post('/export', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { columns, filters } = req.body;

    // Build filter object from request
    const filter: any = {};
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filter.category = filters.category;
      }
      if (filters.status && filters.status !== 'all') {
        filter.status = filters.status;
      }
      if (filters.user_id && filters.user_id !== 'all') {
        filter.user_id = filters.user_id;
      }
      if (filters.startDate || filters.endDate) {
        filter.date = {};
        if (filters.startDate) {
          filter.date.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          filter.date.$lte = new Date(filters.endDate);
        }
      }
    }

    // Get transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Generate unique filename
    const filename = `transactions_export_${Date.now()}.csv`;
    const filepath = path.join(__dirname, '../../exports', filename);

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Define available columns
    const availableColumns: any = {
      id: { id: 'id', title: 'ID' },
      date: { id: 'date', title: 'Date' },
      amount: { id: 'amount', title: 'Amount' },
      category: { id: 'category', title: 'Category' },
      status: { id: 'status', title: 'Status' },
      user_id: { id: 'user_id', title: 'User ID' },
      user_profile: { id: 'user_profile', title: 'User Profile' }
    };

    // Create CSV writer with selected columns
    const selectedColumns = columns.map((col: string) => availableColumns[col]).filter(Boolean);
    
    const csvWriter = csv.createObjectCsvWriter({
      path: filepath,
      header: selectedColumns
    });

    // Transform data for CSV
    const csvData = transactions.map(transaction => {
      const row: any = {};
      columns.forEach((col: string) => {
        if (col === 'date') {
          row[col] = transaction.date.toISOString().split('T')[0];
        } else {
          row[col] = transaction[col as keyof typeof transaction];
        }
      });
      return row;
    });

    // Write CSV file
    await csvWriter.writeRecords(csvData);

    // Send file as download
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Clean up file after download
      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;