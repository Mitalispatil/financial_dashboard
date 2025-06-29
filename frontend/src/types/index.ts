export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface DashboardAnalytics {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalTransactions: number;
  };
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
      category: string; 
    };
    total: number;
    count: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  statusBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  recentTransactions: Transaction[];
}

export interface ExportConfig {
  columns: string[];
  filters?: TransactionFilters;
}