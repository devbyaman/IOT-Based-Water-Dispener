// routes/authRoutes.js
import express from 'express';
import { requestPasswordReset, verifyOTP, resetPassword } from '../controllers/otp.controller.js';
import { validateRequest } from '../middleware/security.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Request password reset OTP
router.post('/request-reset',
    validateRequest([
        body('email').isEmail().normalizeEmail()
    ]),
    requestPasswordReset
);

// Verify OTP
router.post('/verify',
    validateRequest([
        body('email').isEmail().normalizeEmail(),
        body('otp').isLength({ min: 6, max: 6 }).isNumeric()
    ]),
    verifyOTP
);

// Reset password
router.post('/reset-password',
    validateRequest([
        body('email').isEmail().normalizeEmail(),
        body('resetToken').isLength({ min: 32 }),
        body('newPassword').isLength({ min: 8 })
    ]),
    resetPassword
);

export default router;
