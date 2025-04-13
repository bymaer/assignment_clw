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

## Project Setup

### Using Docker (recommended)

The application is containerized using Docker with a multi-container setup:
- Frontend container: React application with Vite
- Backend container: Node.js with Express
- MongoDB container: Database service

1. Make sure Docker and Docker Compose are installed
2. Start the project:
```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- MongoDB: port 27017 (inside Docker)

The containers are configured with:
- Hot-reload for development
- Volume mapping for live code updates
- Container networking for service communication
- Persistent MongoDB data storage

To stop services:
```bash
docker-compose down
```

### Local Development

1. Backend:
```bash
cd backend
npm install
npm run dev
```

2. Frontend:
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

## Security
- Password hashing (bcrypt)
- Protection against SQL injections
- XSS and CSRF protection
- Client and server-side validation

