const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            throw new ApiError(401, 'User not found');
        }
        
        next();
    } catch (error) {
        throw new ApiError(401, 'Not authorized to access this route');
    }
});
