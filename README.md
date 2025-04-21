# Transactions Management System

A full-stack application for managing financial transactions with filtering and saved views capabilities.

## Features

- View, add, edit, and delete transactions
- Filter transactions by:
  - Date range
  - Account
  - Transaction type (Credit/Debit/Others)
  - Amount
  - Category
  - Tags
  - Notes
- Save and manage custom filter views
- Responsive Material-UI based interface
- TypeScript support for type safety

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- @mui/x-date-pickers for date selection
- @mui/x-data-grid for transaction table
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL database
- TypeScript for type safety
- RESTful API endpoints

## Project Structure

```
transactions-ui/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── db.ts         # Database connection
│   │   └── schema.sql    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transactions-ui
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up the database:
- Create a PostgreSQL database
- Update the database connection settings in `backend/src/db.ts`
- Run the schema.sql script to create tables

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## API Endpoints

### Transactions
- GET `/api/transactions` - Get all transactions with optional filters
- POST `/api/transactions` - Create a new transaction
- PUT `/api/transactions/:id` - Update a transaction
- DELETE `/api/transactions/:id` - Delete a transaction

### Views
- GET `/api/views` - Get all saved views
- POST `/api/views` - Create a new view
- PUT `/api/views/:id` - Update a view
- DELETE `/api/views/:id` - Delete a view

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 