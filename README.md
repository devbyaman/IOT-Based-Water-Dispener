# IOT-Based Water Dispenser

## Setup Email for Password Recovery

If you're seeing a "Missing credentials for PLAIN" error when trying to reset your password, you need to configure your email settings:

1. See the detailed setup instructions in the [EMAIL_SETUP.md](./EMAIL_SETUP.md) file.
2. Run the email test script to verify your setup:
   ```
   node api/utils/testEmail.js
   ```

## Getting Started

To get started with the application:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env` file
4. Run the server with `npm start`

## Features

- User authentication
- Password recovery via email OTP
- Water consumption monitoring
- Live data visualization
- Reporting tools

## Technology Stack

- Node.js
- React
- MongoDB
- Express 