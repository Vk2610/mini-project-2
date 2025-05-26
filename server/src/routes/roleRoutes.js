import express from 'express';
import authorizedRole from '../middleware/role.middleware.js';
import userProfileRoutes from './src/routes/userProfile.routes.js';
import applicationRoutes from './src/routes/application.routes.js';
import authRoutes from './src/routes/authRoutes.js';
import claimAmtRoutes from './src/routes/claimAmt.Routes.js';
import receiptRoutes from './src/routes/receiptRoutes.js';
import paymentRoutes from './src/routes/payment.routes.js';

const router = express.Router();

// Only admin can access this route
router.get('/admin', authorizedRole('admin'), (req, res) => {


});

// Both admin and sub-admin can access this route
router.get('/sub-admin', authorizedRole('admin', 'sub-admin'), (req, res) => {
    res.json({ message: 'sub-admin route' });
});

// Everyone can access this route
router.get('/user', authorizedRole('admin', 'sub-admin', 'user'), (req, res) => {
    app.use('/auth', authRoutes);
    app.use('/user', applicationRoutes);
    app.use('/profile', userProfileRoutes);
    // app.use('/form', formRoutes);
    app.use('/claimAmt', claimAmtRoutes);
    app.use('/receipt', receiptRoutes);
    app.use('/payment', paymentRoutes);
});

export default router;