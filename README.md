# Pick4U

A ride-booking / transport app with separate client and server folders.

## Project structure

- client: React + Vite frontend
- server: Express + MongoDB backend

## Prerequisites

- Node.js 18 or 20
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Create your backend environment file:
   ```bash
   cd server
   copy .env.example .env
   ```

3. Update the values in `server/.env` with your actual credentials.

4. Start backend:
   ```bash
   cd server
   npm run dev
   ```

5. Start frontend:
   ```bash
   cd client
   npm run dev
   ```

6. Open the app in the browser at the Vite local URL shown in the terminal.

## Important notes

- The backend requires `MONGO_URI` and `JWT_SECRET` to be set.
- External services such as Cloudinary, Twilio, and Google Maps also need valid keys in `server/.env`.
- This project is not fully production-ready until those credentials are configured and the required services are running.

