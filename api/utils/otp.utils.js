import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate OTP of specified length (default 6 digits)
export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Create email transporter with more detailed configuration
const createTransporter = () => {
    // Check if credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('Email credentials are missing in .env file');
        console.error('Please set EMAIL_USER and EMAIL_PASSWORD variables');
        throw new Error('Email configuration is incomplete');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
    try {
        // Create transporter each time to ensure latest credentials are used
        const transporter = createTransporter();
        
        console.log(`Attempting to send OTP email to ${email}`);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset OTP</h2>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in 15 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}, message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Provide more helpful error messages
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your email credentials.');
            console.error('For Gmail, you need to use an App Password if 2FA is enabled.');
            console.error('See EMAIL_SETUP.md for instructions.');
        }
        
        throw new Error('Failed to send OTP email');
    }
}; 