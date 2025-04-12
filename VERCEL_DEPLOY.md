# Deploying to Vercel

This guide provides instructions for deploying your IOT-Based Water Dispenser application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Git repository with your project
3. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas) or any MongoDB provider

## Setup Steps

### 1. Prepare Your MongoDB Database

- Create a MongoDB Atlas cluster if you don't have one
- Create a database for your application
- Setup a database user with read/write permissions
- Add your IP to the allowlist (or use 0.0.0.0/0 for all IPs)
- Get your MongoDB connection string

### 2. Push Your Code to GitHub

Make sure your code is pushed to a GitHub repository.

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Choose "Other"
   - **Root Directory**: Leave as is (should point to the root of your project)
   - **Build Command**: Leave empty (configured in vercel.json)
   - **Output Directory**: Leave empty (configured in vercel.json)

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `EMAIL_USER`: Email for sending notifications (if applicable)
   - `EMAIL_PASS`: Password or app password for the email account
   - `NODE_ENV`: Set to `production`
   - `FRONTEND_URL`: The URL of your deployed app (will be available after deployment)

6. Click "Deploy"

### 4. Update Frontend URL

After the initial deployment:

1. Go to your project settings in Vercel
2. Find the production URL of your deployed app
3. Update the `FRONTEND_URL` environment variable to match this URL
4. Trigger a redeployment

## Troubleshooting

### Database Connection Issues

- Make sure your MongoDB Atlas IP allowlist includes 0.0.0.0/0 or Vercel's IP ranges
- Check that your connection string is correct in the environment variables

### API Errors

- Check Vercel's function logs for any errors
- Make sure your API routes are correctly defined in vercel.json
- Verify that your CORS settings are allowing your frontend URL

### Auth Issues

- Check that JWT_SECRET is properly set
- Ensure cookies are being set with the correct domain

## Monitoring

Vercel provides monitoring tools for your application:

1. **Logs**: View API function logs from the Functions tab
2. **Analytics**: Monitor traffic and performance
3. **Status**: Check the health of your deployment

By following these steps, your IoT Water Dispenser application should be successfully deployed on Vercel with both frontend and backend components working together. 