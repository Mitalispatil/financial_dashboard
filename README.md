# 💰 Financial Analytics Dashboard

A full-stack financial application for visualizing, filtering, and exporting company transaction data. This tool is built for financial analysts to interactively explore transaction trends and generate insightful reports.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login/logout system
- Secure API endpoints with token validation
- Role-based demo accounts: Admin, Analyst, Viewer

### 📊 Dashboard
- Summary cards: Total Balance, Revenue, Expenses, Savings
- Monthly Revenue vs Expenses bar chart
- Responsive layout with dark theme

### 📋 Transactions
- Paginated, searchable, sortable transaction table
- Filters by date, amount, category, and status
- Real-time updates

### 📎 CSV Export
- Customizable column selection
- On-click export
- Automatic CSV download in browser

---

## 🛠️ Tech Stack

### Frontend
- React.js + TypeScript
- Material UI (MUI)
- Recharts (for chart visualizations)
- React Router, Axios

### Backend
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- JWT for authentication
- CSV Writer library

---

## 🔧 Setup Instructions

### 1. Clone the Repository
git clone https://github.com/Mitalispatil/financial_dashboard.git
cd financial_dashboard


### 2. Install Dependencies

#### Backend
cd backend
npm install

#### Frontend
cd ../frontend
npm install

---

### 3. Configure Environment Variables

#### 🔐 Backend `.env`
Create a `.env` file in `/backend` folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

#### 🌐 Frontend `.env`
Create a `.env` file in `/frontend` folder:
REACT_APP_API_URL=http://localhost:5000/api

---

### 4. Run the Application

#### Backend
cd backend
npm run dev

#### Frontend
cd frontend
npm start

---

## 📄 API Documentation

### Authentication
- `POST /api/auth/login` – Login with email & password (returns JWT)
- `GET /api/auth/profile` – Get current logged-in user info

### Transactions
- `GET /api/transactions` – Fetch all transactions
- `GET /api/transactions/export` – Export selected columns as CSV

---

## 📦 Sample Demo Accounts
| Role    | Email                      | Password     |
|---------|----------------------------|--------------|
| Admin   | admin@financial.com        | 🔒 Hidden    |
| Analyst | analyst@financial.com      | 🔒 Hidden    |
| Viewer  | viewer@financial.com       | 🔒 Hidden    |

---

Created by **Mitali Patil**  
