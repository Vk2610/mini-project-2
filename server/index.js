import express from 'express';
import { checkConnection } from './src/config/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';
import authenticateToken from './src/middleware/auth.middleware.js';
import userProfileRoutes from './src/routes/userProfile.routes.js';
import applicationRoutes from './src/routes/application.routes.js';
import authRoutes from './src/routes/authRoutes.js';
import claimAmtRoutes from './src/routes/claimAmt.Routes.js';
import receiptRoutes from './src/routes/receiptRoutes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import subAdminRoutes from './src/routes/sub-adminRoutes.js';
import adminRoutes from './src/routes/admin.routes.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// auth routes
app.use('/auth', authRoutes);


app.use('/user', applicationRoutes);
app.use('/profile', userProfileRoutes);
app.use('/claimAmt', claimAmtRoutes);
app.use('/receipt', receiptRoutes);
app.use('/payment', paymentRoutes);


// sub-admin routes
app.use('/sub-admin', subAdminRoutes);

// admin routes
app.use('/admin', adminRoutes);

// Start the server
app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  try {
    await checkConnection();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});