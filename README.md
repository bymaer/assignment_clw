# Authentication System

## Overview
Web application with authentication system built using Node.js, React, and MongoDB.

## Core Features
- User authentication (email + password)
- JWT tokens with 30-minute lifetime
- Secure password storage
- Responsive design

## Technologies
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Containerization: Docker, Docker Compose

## Getting Started

### Prerequisites
- Git
- Docker Desktop
- Docker Compose

### Clone and Run
1. Clone the repository
```bash
git clone https://github.com/your-username/authentication-system.git
cd authentication-system
```

2. Start the application using Docker (recommended)
```bash
docker-compose up --build
```

After the build completes, the services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- MongoDB: port 27017 (inside Docker)

To stop the application:
```bash
docker-compose down
```

### Test Credentials
You can use these credentials to test the application:
- Email: test@example.com
- Password: Test@12345

### Development Setup (Alternative)

If you prefer to run services individually:

1. Backend setup:
```bash
cd backend
npm install
npm run dev
```

2. Frontend setup:
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

All required variables are configured in docker-compose.yml:
- JWT_SECRET=reJxyp-mesmuq-vixfu5
- PORT=3001
- MONGODB_URI=mongodb://mongodb:27017/myapp

## Validation
### Email
- Valid email format check

### Password
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

## Security Features
- Password hashing (bcrypt)
- Protection against SQL injections
- XSS and CSRF protection
- Client and server-side validation
- Rate limiting on authentication endpoints
- Account lockout after 5 failed attempts

## Docker Features
- Hot-reload for development
- Volume mapping for live code updates
- Container networking for service communication
- Persistent MongoDB data storage

