import express from 'express';
import { checkConnection } from './src/config/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from '../server/src/routes/user.js';

const app = express();

// register and login user 
app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  try {
    await checkConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});