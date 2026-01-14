const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpire
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user._id);

    res.status(201).json(new ApiResponse(201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
        token
    }, 'User registered successfully'));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const token = generateToken(user._id);

    res.status(200).json(new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
        token
    }, 'Login successful'));
});

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json(new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        wallet:user.wallet
    }, 'Profile fetched successfully'));
});
