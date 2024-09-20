const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    try {
        const verified = jwt.verify(token, jwtSecret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
