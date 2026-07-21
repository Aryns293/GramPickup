const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().matches(/^[0-9+\-\s]{10,15}$/).withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6, max: 72 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'shopkeeper']).withMessage('Role must be customer or shopkeeper'),
];

const loginRules = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const profileRules = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
  body('phone').optional().trim().matches(/^[0-9+\-\s]{10,15}$/).withMessage('Valid phone number is required'),
  body('password').optional().isLength({ min: 6, max: 72 }).withMessage('Password must be at least 6 characters'),
];

// @desc    Register a new user (Customer or Shopkeeper)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validate(registerRules), async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Set role validation
    const userRole = role === 'shopkeeper' ? 'shopkeeper' : 'customer';

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validate(loginRules), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // Find shop if shopkeeper
      let shop = null;
      if (user.role === 'shopkeeper') {
        shop = await Shop.findOne({ ownerId: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shop: shop, // Returns shop if registered
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, validate(profileRules), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Forgot password — send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email required'),
], validate([body('email').isEmail().withMessage('Valid email required')]), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond the same — don't leak whether email exists
    const genericMsg = { message: 'If an account with that email exists, a reset link has been sent.' };

    if (!user) return res.json(genericMsg);

    const crypto = require('crypto');
    const { sendEmail } = require('../utils/email');

    // Generate raw token and hashed version to store
    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const resetUrl     = `${clientOrigin}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'GramPickup — Reset Your Password',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#4f46e5">Reset your password</h2>
            <p>Hi ${user.name},</p>
            <p>Someone requested a password reset for your GramPickup account. Click the button below to set a new password. This link expires in <strong>10 minutes</strong>.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
              Reset Password
            </a>
            <p style="color:#6b7280;font-size:13px">If you didn't request this, ignore this email. Your password won't change.</p>
            <p style="color:#6b7280;font-size:13px">Or copy this link:<br/>${resetUrl}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn('[Forgot Password] Failed to send email:', emailErr.message);
      return res.status(500).json({ message: 'Email server rejected login: ' + emailErr.message });
    }

    res.json(genericMsg);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
router.put('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate([body('password').isLength({ min: 6 })]), async (req, res) => {
  try {
    const crypto      = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
    }

    user.password             = req.body.password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now sign in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: 'Access token required' });

    // Fetch user info from Google
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!googleRes.ok) return res.status(401).json({ message: 'Invalid Google token' });

    const { email, name, sub: googleId } = await googleRes.json();
    if (!email) return res.status(400).json({ message: 'Could not get email from Google' });

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Check if this new user matches the configured admin email
      const isAdmin = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

      // New user — create as customer (or admin if email matches)
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        phone: '0000000000',
        password: googleId + process.env.JWT_SECRET, // Non-guessable password
        role: isAdmin ? 'admin' : 'customer',
      });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;
