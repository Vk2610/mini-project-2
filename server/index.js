import express from 'express';
import { checkConnection } from './src/config/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.js'; // Corrected path
import formRoutes from './src/routes/form.js'; // Corrected path

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/form', formRoutes);

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