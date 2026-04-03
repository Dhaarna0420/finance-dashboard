# Finance Data Processing & RBAC Backend

A professional Node.js backend for managing financial records with Role-Based Access Control (RBAC), JWT authentication, and SQLite persistence.

## Features
- **User Management**: Register, login, and profile management with status control.
- **RBAC**: Three distinct roles: `Admin`, `Analyst`, and `Viewer`.
- **Financial Records**: CRUD operations with advanced filtering by date, category, and type.
- **Dashboard**: Real-time summary and trend analytics.
- **Security**: JWT-based authentication and secure password hashing with Bcrypt.
- **Validation**: Strict input validation using `express-validator`.
- **Testing**: Integrated test suite with `Jest` and `Supertest`.

## Tech Stack
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Language**: Modern JavaScript (ES Modules)

## Getting Started

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example` or just use the default provided in setup):
   ```env
   PORT=3000
   DATABASE_URL=./data/finance.sqlite
   JWT_SECRET=your_jwt_secret
   ```

### Running the App
- **Development**: `npm run dev` (uses nodemon)
- **Production**: `npm start`
- **Testing**: `npm test`

## API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | Public |
| `POST` | `/login` | Login and receive a JWT | Public |

### 📊 Financial Records (`/api/records`)
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | View all records (Filter by `startDate`, `endDate`, `category`, `type`) | All |
| `POST` | `/` | Create a new record | Admin |
| `PATCH` | `/:id` | Update a record | Admin |
| `DELETE` | `/:id` | Delete a record | Admin |

### 📈 Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/summary` | Financial summary (income, expenses, balance) | Admin, Analyst |
| `GET` | `/trends` | Monthly aggregates | Admin, Analyst |

## Role Permission Matrix

| Action | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| View Records | ✅ | ✅ | ✅ |
| Create/Edit/Delete Records | ✅ | ❌ | ❌ |
| View Financial Summaries | ✅ | ✅ | ❌ |
| View Analytics Trends | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

## Default Credentials & Sample Data (Seeded)
- **Admin User**: `admin` / `admin123`
- **Sample Data**: The database is automatically seeded with 9 financial records (Salary, Rent, Utilities, etc.) if the `financial_records` table is empty.
