# E-Wallet API Initialization Guide

This guide will help you set up and run the E-Wallet API.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)

## 1. Clone the Repository
Clone this project:
```sh
git clone <your-repo-url>
cd ewall-api/server
```

## 2. Install Dependencies
Install all required packages:
```sh
npm install
```

## 3. Environment Variables
Create a `.env` file in the `server` directory. Based on the .env.example file

## 4. Database Setup
Run Prisma migrations to set up the SQLite database:
```sh
npx prisma migrate deploy
```

## 5. Start the API Server
Start the server with:
```sh
npm run start
```

The API will be available at `http://localhost:3000` (or the port set in your environment).

## 6. API Endpoints
See `Api-Endpoints.md` for available endpoints and usage.