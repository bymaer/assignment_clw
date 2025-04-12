# Test Assignment: Simple Authentication System

## Overview
This is a simple authentication system for a web application built with Node.js, React, MySQL, and MongoDB. The system includes the following features:

- User login with email and password validation
- Token-based authentication using JWT
- Session expiration (30 minutes)
- Secure password storage (hashed)
- Responsive design for mobile and desktop

This project demonstrates best practices in security, session management, and responsive front-end development.

## Features
- **Login Form**: Collects the user's email and password.
  - Email validation: Ensures the email is in a valid format.
  - Password validation: Ensures a minimum length of 6 characters.
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
- **Databases**: MySQL, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, Helmet for securing HTTP headers.

## Setup and Installation

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (version >= 14)
- **npm** (or **yarn** for package management)
- **MySQL** and/or **MongoDB** installed and running

### Steps to Run Locally

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/bymaer/assignment_clw.git
    cd simple-authentication-system
    ```

2. **Install Dependencies**:
    For the backend:
    ```bash
    cd backend
    npm install
    ```
    For the frontend:
    ```bash
    cd frontend
    npm install
    ```

3. **Setup Database**:
    - Create a MySQL database and configure it with the `.env` file in the backend.
    - Set up MongoDB for storing session information or any additional data (optional).

4. **Run the Application**:
    To run the backend:
    ```bash
    cd backend
    npm start
    ```
    To run the frontend:
    ```bash
    cd frontend
    npm start
    ```

5. **Access the Application**:
    Open a browser and navigate to `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API (or whatever ports are specified in the configuration).

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

