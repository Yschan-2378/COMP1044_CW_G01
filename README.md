# COMP1044 Internship System

Small guide for running the frontend and backend locally.

## Prerequisites

- Node.js and npm
- PHP
- MySQL

## Database

Import the provided database file into MySQL:

```bash
mysql -u root < COMP1044_database.sql
```

The backend currently connects to:

- Host: `localhost`
- Database: `comp1044_internship_db`
- Username: `root`
- Password: empty

If your MySQL details are different, update `backend/api/db.php`.

Seeded login accounts use the password `admin123`. Example usernames include `admin`, `jchen`, `slin`, `madams`, and `rpatel`.

## Backend

From the project root, run:

```bash
php -S localhost:8000 -t backend
```

The API will be available at:

```text
http://localhost:8000/api
```

## Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

By default, the frontend calls `http://localhost:8000/api`. To use a different backend URL, create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Useful Commands

```bash
cd frontend
npm run lint
npm run build
```
