# Transactions Management System

A full-stack application for managing financial transactions with filtering and view saving capabilities.

## Features

- View transactions in a paginated table
- Add, edit, and delete transactions
- Filter transactions by various criteria
- Save and manage filter views
- Responsive design

## Tech Stack

- Frontend: React, Material-UI, Vite
- Backend: Node.js, Express
- Database: PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd transactions-ui
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a PostgreSQL database and update the `.env` file with your database credentials:
```
PORT=3002
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

5. Run the database schema:
```bash
psql -U your_db_user -d your_db_name -f schema.sql
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

## API Endpoints

### Transactions
- GET /api/transactions - Get all transactions with optional filters
- POST /api/transactions - Create a new transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Delete a transaction

### Views
- GET /api/views - Get all saved views
- POST /api/views - Save a new view or update existing
- DELETE /api/views/:id - Delete a view

## Development

The project structure is organized as follows:

```
transactions-ui/
├── client/                 # React frontend with Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   └── package.json
├── routes/                # Express routes
├── db.js                 # Database connection
├── server.js             # Express server
├── schema.sql            # Database schema
└── package.json          # Backend dependencies
```

## Building for Production

To build the frontend for production:

```bash
cd client
npm run build
```

The built files will be in the `client/dist` directory. 