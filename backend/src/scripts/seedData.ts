import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/transaction';
import User from '../models/User';
import { connectDatabase } from '../config/database';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const transactionsPath = path.join(__dirname, '../data/transactions.json');
const sampleTransactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf-8'));

const sampleUsers = [
  { email: 'admin@financial.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'analyst@financial.com', password: 'analyst123', name: 'Financial Analyst', role: 'analyst' },
  { email: 'viewer@financial.com', password: 'viewer123', name: 'Report Viewer', role: 'viewer' }
];

async function seedDatabase() {
  try {
    await connectDatabase();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Transaction.deleteMany({});
    await User.deleteMany({});
    
    console.log('🧹 Cleared existing data');

    // Seed users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`👤 Created user: ${user.email}`);
    }

    // Seed transactions
    for (const transactionData of sampleTransactions) {
      const transaction = new Transaction({
        ...transactionData,
        date: new Date(transactionData.date)
      });
      await transaction.save();
    }

    console.log(`💰 Created ${sampleTransactions.length} transactions`);
    console.log('✅ Database seeding completed successfully!');
    
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@financial.com / admin123');
    console.log('Analyst: analyst@financial.com / analyst123');
    console.log('Viewer: viewer@financial.com / viewer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();