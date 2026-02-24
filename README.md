# Kost Search Application

Fullstack search application for boarding houses (Kost) around Universitas Klabat.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MySQL

## Prerequisites
- Node.js installed
- MySQL installed and running

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `kost_db` (or allow the script to do it).
2. Configure your database credentials in `backend/.env`.
3. Initialize the database:
   ```bash
   cd backend
   node scripts/init_db.js
   ```

### 2. Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`.

## Features
- **Guest**: Search kost, view details, contact owner via WhatsApp, view location on Google Maps, Chatbot.
- **Owner**: Login, Dashboard (basic structure).

## Environment Variables (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=kost_db
JWT_SECRET=your_jwt_secret
```
