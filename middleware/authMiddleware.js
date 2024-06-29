const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const authMiddleware = {};

const blacklistToken = []; 

authMiddleware.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Ambil token sebenarnya dari header Authorization
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    // Periksa apakah token ada di blacklist
    if (blacklistToken.includes(token)) {
        return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }

    try {
        const decode = jwt.verify(token, secret_key);
        req.userId = decode.id;
        next();
        console.log("uid: "+req.userId);
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Token is not valid' });
    }
};

module.exports = authMiddleware;
