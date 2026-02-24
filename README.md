# Kost Search Application

Fullstack search application for boarding houses (Kost) around Universitas Klabat.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, SQLite (local file)

## Prerequisites
- Node.js installed

## Setup Instructions

### 1. Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env .env.local  # optional
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

> SQLite database file will be created automatically at `backend/data/kost.db` on first run.

### 2. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## Features
- **Guest**: Search kost, view details, contact owner via WhatsApp, view location on Google Maps, Chatbot.
- **Owner**: Login, Dashboard (basic structure).

## Environment Variables (`backend/.env`)
```env
PORT=5000
SQLITE_PATH=./data/kost.db
JWT_SECRET=change_me_for_production
GEMINI_API_KEY=your_gemini_api_key_here
```
