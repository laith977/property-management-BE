
# 🧪 Property Management Backend (NestJS)

This is the **backend application** for the Full Stack Property Management task.  
It is built with **NestJS** and provides a secure, modular, and RESTful API for user authentication and property management.

---

## 🎯 Project Goal

Build a small web application that allows users to:

- ✅ Register and log in
- 🏡 Create, view, update, and delete properties
- 📄 See their own properties in a list

---

## 🧱 Tech Stack

- **NestJS** – Scalable backend framework
- **TypeORM** – Database ORM
- **MySQL** (or PostgreSQL)
- **JWT** – Authentication
- **REST API** – CRUD for users and properties

---

## 📁 Folder Structure

```
/src
├── auth        # JWT Auth (Guard, Decorator, Service)
├── user        # Entity, DTO, Controller, Service
├── property    # Entity, DTO, Controller, Service
└── common      # Shared utilities, interceptors, decorators
```

---

## 🗂️ Features

### 1. 🔐 Authentication

- Register / Login endpoints
- JWT token-based authentication
- AuthGuard to protect routes
- User info decoded via custom decorator

### 2. 🏘️ Property Management

Each property includes:  
`title`, `description`, `price`, `location`, and `createdAt`

Authenticated users can:

- ➕ Create a property
- 📝 Edit a property
- ❌ Delete a property
- 👀 View **only their own** properties

---

## ⚙️ Installation & Setup

### 📋 Prerequisites

- Node.js (v16+)
- MySQL installed locally

---

### 🛠️ MySQL Setup Instructions

Before running the app, ensure you have **MySQL** installed and running locally.

1. **Create a new database:**

   Open MySQL CLI or a GUI like phpMyAdmin and run:

   ```sql
   CREATE DATABASE managementDB;
   ```

2. **Set up `.env` variables:**

   Create a `.env` file in the project root:

   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=managementDB
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the application:**

   ```bash
   npm install
   npm run start:dev
   ```

---

## 🚀 API Endpoints

### Auth Routes

- `POST /auth/register`
- `POST /auth/login`

### Property Routes (Authenticated)

- `GET /properties` – Get all properties by current user
- `POST /properties` – Create a new property
- `PATCH /properties/:id` – Update a property
- `DELETE /properties/:id` – Delete a property

Happy coding! 💻✨