import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Main test function
async function testEmailSending() {
    console.log('Email configuration:');
    console.log('- EMAIL_USER:', process.env.EMAIL_USER);
    console.log('- EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
    
    // Create transporter with debug logging
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true, // Enable verbose logging
        logger: true // Log to console
    });
    
    console.log('Verifying transporter...');
    try {
        const verification = await transporter.verify();
        console.log('Transporter verified:', verification);
    } catch (error) {
        console.error('Transporter verification failed:', error);
        console.log('\nFor Gmail, you need to:');
        console.log('1. Enable 2-Step Verification on your Google account');
        console.log('2. Generate an App Password at https://myaccount.google.com/apppasswords');
        console.log('3. Use that App Password in your .env file');
        return;
    }
    
    console.log('Sending test email...');
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email',
            text: 'If you receive this email, your email configuration is working correctly!',
            html: '<b>If you receive this email, your email configuration is working correctly!</b>'
        });
        
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Run the test
testEmailSending().catch(console.error); 