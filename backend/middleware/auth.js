import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protectRest = (req, res, next) => {
    let cookieToken = req.cookies?.jwt;
    let headerToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        headerToken = req.headers.authorization.split(' ')[1];
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // Attempt to verify header token first (it's often more current)
    if (headerToken) {
        try {
            const decoded = jwt.verify(headerToken, secret);
            req.user = decoded;
            return next();
        } catch (err) {
            console.log('DEBUG: Header token verification failed:', err.message);
            // Don't return yet, try cookie
        }
    }

    // Fallback to cookie token
    if (cookieToken) {
        try {
            const decoded = jwt.verify(cookieToken, secret);
            req.user = decoded;
            return next();
        } catch (err) {
            console.log('DEBUG: Cookie token verification failed:', err.message);
        }
    }

    // If we reach here, no valid token was found
    return res.status(401).json({ success: false, message: 'Unauthenticated or invalid token' });
};
