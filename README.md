# Test Assignment: Simple Authentication System

## Overview
This is a simple authentication system for a web application built with Node.js, React, and MongoDB. The system includes the following features:

- User login with email and password validation
- Token-based authentication using JWT
- Session expiration (30 minutes)
- Secure password storage (hashed)
- Responsive design for mobile and desktop

This project demonstrates best practices in security, session management, and responsive front-end development.

## Features
- **Login Form**: Collects the user's email and password.
  - Email validation: Ensures the email is in a valid format.
  - Password validation: Requires minimum 8 characters, including at least:
    - One uppercase letter
    - One lowercase letter
    - One number
    - One special character
- **Authentication Flow**: 
  - If not logged in, the user sees the login form.
  - If logged in, the user is redirected to a welcome page showing "Hello, {email}".
  - A "Logout" button that logs the user out and redirects them back to the login form.
- **Session Management**: 
  - JWT tokens with a 30-minute expiration time.
- **Security**:
  - Protection against SQL Injection, XSS, and CSRF.
  - Input validation on both client and server sides.
  
## Technologies Used
- **Frontend**: React, CSS, HTML
- **Backend**: Node.js, Express
- **Database**: MongoDB (in-memory server for testing/demo purposes)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, Helmet for securing HTTP headers.

## Setup and Installation

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (version >= 14)
- **npm** (or **yarn** for package management)
- No database installation required as the project uses in-memory MongoDB for demonstration

### Steps to Run Locally

A project that includes React (Vite) frontend and Express.js backend.

## Running the Project

There are two ways to run this project:

### 1. Classic Way (two terminals)

#### Start the backend:
```bash
cd backend
npm install
npm run dev
```
Backend will be available at http://localhost:3001

#### Start the frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at http://localhost:5173

### 2. Using Docker (recommended)

Prerequisites: Docker and Docker Compose installed.

1. Clone the repository
2. In the root directory, run:
```bash
docker-compose up
```

This will start both services:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

To stop the services: 
```bash
docker-compose down
```

## Development

When using Docker, all code changes are automatically tracked and applied thanks to configured volumes. Hot reload is enabled for both frontend and backend.

## Usage

1. **Login**: 
   - Enter a valid email and password in the login form.
   - If valid, you will be redirected to the welcome page.

2. **Logout**: 
   - Click the "Logout" button to log out and be redirected back to the login form.

3. **Session Expiration**:
   - After 30 minutes, the session will expire and you will be automatically logged out.

## Security Considerations
- All passwords are securely hashed before being stored in the database using bcrypt.
- JWT tokens are used for session management and are securely stored.
- Input is validated both client-side (React) and server-side (Node.js) to prevent security vulnerabilities such as SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).

## Bonus Features (Optional)
- The design is **responsive** and works on both desktop and mobile devices.
- Includes a clean and minimal user interface with simple error handling.

## Documentation
- **Login Page**: Handles user login with basic validation for email and password.
- **Welcome Page**: Shows a welcome message and includes a logout button.
- **Backend API**: Manages user authentication and session management.
- **Security**: Ensures secure handling of passwords and sessions.

