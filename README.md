# 💳 Pocket Pay (Mini Wallet App)

![Pocket Pay Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=2000&h=500)

A modern, fast, and secure digital wallet application built with **Laravel 11** and **React 19**. Pocket Pay allows users to manage their daily finances, perform instant top-ups, and transfer balances seamlessly with a premium and responsive user interface.

## ✨ Key Features

- **🔐 Secure Authentication:** Stateful cookie-based authentication using Laravel Sanctum.
- **💰 Instant Top-Up:** Add balance to your wallet instantly.
- **💸 Seamless Transfers:** Transfer money to other users securely with ACID-compliant database transactions.
- **📊 Transaction History:** Keep track of all your incoming and outgoing transactions.
- **🎨 Premium UI/UX:** A stunning, responsive Single Page Application (SPA) built with React and customized Material UI.

## 🛠️ Tech Stack

### Frontend (Client)
- **React 19** (Vite)
- **Material UI (MUI)** v6 - For premium, accessible components
- **Axios** - For API communication & interceptors
- **React Router DOM** - For seamless SPA navigation

### Backend (API)
- **Laravel 11** - Robust PHP framework
- **Laravel Sanctum** - For secure SPA authentication
- **MySQL** - Relational database for transactional integrity

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm (or yarn)
- MySQL Database

### 1. Backend Setup (Laravel API)

```bash
# Navigate to the backend directory
cd mini-wallet-api

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

**Configure Database:**
Open the `.env` file in `mini-wallet-api` and set your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.1
DB_PORT=3306
DB_DATABASE=pocket_pay
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# Run database migrations and seeders (optional)
php artisan migrate --seed

# Start the Laravel development server
php artisan serve
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup (React Web)

```bash
# Open a new terminal and navigate to the frontend directory
cd mini-wallet-web

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env
```

**Configure API URL:**
Ensure your `.env` in `mini-wallet-web` points to the Laravel backend:
```env
VITE_API_URL=http://localhost:8000
```

```bash
# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🏗️ Architecture & Database Design

- **Decoupled Architecture:** The system uses a strict decoupled architecture. The React frontend consumes RESTful APIs provided by the Laravel backend.
- **Database Consistency:** Financial transactions (transfers) are wrapped in **Database Transactions** to ensure ACID principles, preventing lost balances during unexpected system failures.
- **State Management:** React Context API is utilized for managing authentication and wallet states efficiently without prop drilling.

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
