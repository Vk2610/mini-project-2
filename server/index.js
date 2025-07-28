import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { checkConnection } from './src/config/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';
import userProfileRoutes from './src/routes/user/userProfile.routes.js';
import applicationRoutes from './src/routes/user/application.routes.js';
import authRoutes from './src/routes/authRoutes.js';
import claimAmtRoutes from './src/routes/user/claimAmt.Routes.js';
import receiptRoutes from './src/routes/user/receiptRoutes.js';
import paymentRoutes from './src/routes/user/payment.routes.js';
import subAdminRoutes from './src/routes/sub-adminRoutes.js';
import adminRoutes from './src/routes/admin.Routes.js';
import statRoutes from './src/routes/stat.routes.js';
import verifyToken from './src/middleware/auth.middleware.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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

// statistics routes
app.use('/stats', statRoutes);



// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Upload PDF endpoint
app.post('/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'pdfs',
      timeout: 60000 // Add timeout of 60 seconds
    });

    // Clean up: Delete temporary file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Clean up on error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

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