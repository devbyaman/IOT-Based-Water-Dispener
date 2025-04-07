import OTP from '../models/otp.model.js';
import User from '../models/user.model.js';
import { generateOTP, sendOTPEmail } from '../utils/otp.utils.js';
import bcrypt from 'bcryptjs';

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate and save OTP
        const otp = generateOTP();
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Generate reset token
        const resetToken = generateOTP(32);
        await OTP.create({
            email,
            otp: resetToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken
        });
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Verify reset token
        const otpRecord = await OTP.findOne({
            email,
            otp: resetToken,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        // Mark reset token as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 