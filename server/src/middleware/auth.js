import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Token missing' });

    const token = authHeader.split(' ')[1]; // 'Bearer <token>'
    if (!token) return res.status(401).json({ message: 'Invalid token format' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authenticateToken;