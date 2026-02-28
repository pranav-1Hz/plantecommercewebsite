# E-commerce Plants Shop

A full-stack e-commerce application for selling plants, featuring a React frontend, Node.js/Express backend, and MySQL database with Sequelize ORM.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MySQL Server](https://www.mysql.com/downloads/)

## Getting Started

### 1. Database Setup

Create a new MySQL database named `plantshop`:

```sql
CREATE DATABASE plantshop;
```

### 2. Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Check the `.env` file in the `server` directory and ensure the database credentials match your local MySQL configuration:
   ```env
   DB_NAME=plantshop
   DB_USER=root
   DB_PASSWORD=root
   DB_HOST=localhost
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will automatically sync models and create tables on startup.*

### 3. Frontend Setup (Client)

1. Open a new terminal in the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

## Key Features

- **Admin Dashboard**: Manage nurseries, plants, and feedback.
- **Nursery Application**: Nurseries can apply and manage their own inventory upon approval.
- **Modern UI**: Consistent and professional design using styled-components.
- **MySQL Integration**: Persistent storage using Sequelize ORM.

## Troubleshooting

If you encounter OpenSSL issues on newer Node.js versions during `npm start`, use:
```bash
set NODE_OPTIONS=--openssl-legacy-provider && npm start
```

To kill any process on port 5000:

```taskkill /F /PID 3448```

## Author

Developed by **Pranav**.
