# Email Setup for Password Recovery

This application uses Gmail for sending password reset emails. Follow these steps to set up the email functionality:

## Gmail Setup Steps

1. **Use a Gmail Account**
   - You need a Gmail account to use for sending emails
   - Consider creating a dedicated Gmail account for your application

2. **Enable 2-Step Verification**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Under "Signing in to Google", enable 2-Step Verification

3. **Generate an App Password**
   - After enabling 2-Step Verification, go to: https://myaccount.google.com/apppasswords
   - Select "App" dropdown: Choose "Other (Custom name)"
   - Enter a name for your app (e.g., "IOT Device Password Reset")
   - Click "Generate"
   - Google will display a 16-character app password (without spaces)
   - **Important**: Copy this password immediately - it will only be shown once!

4. **Update Your .env File**
   - Open the `.env` file in your project root
   - Update the EMAIL_USER and EMAIL_PASSWORD values:
   ```
   EMAIL_USER=your.gmail.address@gmail.com
   EMAIL_PASSWORD=your16characterapppassword
   ```

5. **Test Email Configuration**
   - Run the test script to verify your email setup:
   ```
   node api/utils/testEmail.js
   ```
   - If everything is set up correctly, you'll receive a test email

## Troubleshooting

- **"Missing credentials for PLAIN" Error**: This typically means your EMAIL_USER or EMAIL_PASSWORD is incorrect
- **"Invalid login" Error**: Double-check that you're using an App Password, not your normal Gmail password
- **Email Not Sending**: Make sure your Gmail account doesn't have additional security restrictions
- **Additional Help**: For more information, see [Nodemailer Gmail documentation](https://nodemailer.com/usage/using-gmail/)

## Security Notes

- Never commit your .env file with real credentials to version control
- Consider using a service like SendGrid or Mailgun for production environments
- Regularly rotate your app passwords for better security 