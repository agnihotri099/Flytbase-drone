# Drone Management System

A comprehensive RESTful API service for managing drones, missions, and flight logs. This system allows users to track drone operations, plan missions, and maintain flight records.

## Features

- 🚁 Drone Management
- 🎯 Mission Planning
- 📝 Flight Logging
- 🔐 JWT Authentication
- 🗃️ MongoDB Database
- 🐳 Docker Support

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker, Docker Compose
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose
- MongoDB (if running locally)

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
    git clone https://github.com/yourusername/drone-management.git
    cd drone-management
```

2. Create environment file:
```bash
    NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/drone_management
    JWT_SECRET=your_secure_jwt_secret
    PORT=3000
```


3. Build and run with Docker Compose:
```bash
    docker-compose up --build
```


The API will be available at `http://localhost:3000`

### Local Development

1. Install dependencies:
```bash
    npm install
```

2. Set up environment variables:
```bash
    cp .env.example .env
    Edit .env with your configurations
```



3. Start the development server:
```bash
    npm run dev
```

The API will be available at `http://localhost:3000`


## API Documentation

### Authentication

#### Register User

POST /api/auth/register
Content-Type: application/json
{
"name": "Test User",
"email": "test@example.com",
"password": "password123"
}


#### Login

POST /api/auth/login
Content-Type: application/json
{
"email": "test@example.com",
"password": "password123"
}



### Drones

#### Get All Drones

GET /api/drones
Authorization: Bearer <token>


#### Get Single Drone

GET /api/drones/:id
Authorization: Bearer <token>


## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build TypeScript code
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint

### Docker Commands

Build the containers:
```bash
    docker-compose build
```

Start the services:
```bash
    docker-compose up
```

Stop the services:
```bash
    docker-compose down
```


View logs:
```bash
    docker-compose logs -f
```


