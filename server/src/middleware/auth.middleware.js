import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.startsWith('Bearer')
        ? authHeader.split(' ')[1]
        : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Access Denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid Token' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;