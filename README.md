# Teenager Expense Tracker

A full-stack web application for teenagers and students to track spending, manage budgets, monitor income, and understand their money habits through simple educational insights.

## Project overview

This app is built as a React frontend + Express backend with JWT auth and Supabase-ready data access. It is designed to be easy to understand, responsive on mobile, and suitable for demo use.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT protected routes
- Expense tracking with search, filter, sort, and pagination
- Income tracking
- Budget management with progress bars
- Savings goals with visual progress
- Dashboard with summary cards and charts
- Personalized spending recommendations
- Responsive design for mobile, tablet, and desktop
- Dark mode toggle
- Error, loading, and empty states

## Tech stack

Frontend:
- React
- Vite
- React Router
- Recharts
- Axios
- CSS

Backend:
- Node.js
- Express
- PostgreSQL + Supabase-ready architecture
- JWT
- bcrypt
- express-validator

## Folder structure

```text
teenager-expense-tracker/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── README.md
└── .env.example (optional root default)
```

## Prerequisites

- Node.js 18+
- npm
- Supabase project (optional but recommended)

## Backend setup

```bash
cd teenager-expense-tracker/backend
npm install
cp .env.example .env
npm run dev
```

## Frontend setup

```bash
cd teenager-expense-tracker/frontend
npm install
cp .env.example .env
npm run dev
```

## Environment variables

### Backend

Create backend/.env from .env.example:

```env
PORT=5000
JWT_SECRET=your_super_secret_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLIENT_URL=http://localhost:5173
```

### Frontend

Create frontend/.env from .env.example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Supabase setup

1. Create a project in Supabase.
2. Open SQL editor.
3. Run the following schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  income_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saving_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(10,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Then enable RLS and configure user-owned policies if you want strict access control.

## Database security

The backend always scopes queries to the signed-in user id from the JWT. Frontend never sends a user id to the backend as a trusted input.

## How authentication works

- User registers with name, email, and password.
- Password is hashed with bcrypt before storing.
- User logs in with email and password.
- Backend compares the submitted password to the saved hash with bcrypt.compare().
- If valid, the backend issues a JWT.
- Protected endpoints require that JWT in the Authorization header.
- The middleware reads the token, verifies it, and attaches the authenticated user id to the request.

## How to run the app

Backend:

```bash
cd teenager-expense-tracker/backend
npm install
npm run dev
```

Frontend:

```bash
cd teenager-expense-tracker/frontend
npm install
npm run dev
```

## Testing instructions

1. Start backend.
2. Start frontend.
3. Open the app in the browser.
4. Register a new account.
5. Log in.
6. Add expenses and income.
7. Create a budget and a savings goal.
8. Open dashboard and analytics pages.
9. Verify charts update from backend data.
10. Check logout, error states, and route protection.

## Security notes

- No plaintext passwords are stored.
- No JWT secret is exposed to the frontend.
- No Supabase service-role key is exposed to the browser.
- All user-owned data is filtered by the authenticated user id.

## Future improvements

- Export CSV reports
- Smart recurring expense detection
- Better recommendation engine
- Multi-currency support
- Offline-first syncing
