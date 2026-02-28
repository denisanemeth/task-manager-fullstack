# Task Manager - Full Stack Application

> Educational project demonstrating a full-stack task management application. This is a work in progress and intended for learning purposes only.

## Overview

A simple task management system with user authentication and CRUD operations for personal tasks.

**Stack:**
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: Vanilla HTML, CSS, JavaScript
- Authentication: JWT with bcrypt password hashing
- Development: Docker Compose for local setup

**Live Demo:** https://task-manager-fullstack-latest-3.onrender.com

## Features

- User registration and login with email/password
- JWT-protected API endpoints
- Personal task management (create, read, update, delete)
- Task properties: title, description, status, due date
- Tasks filtered by authenticated user
- Responsive static frontend

## Project Structure
```
.
├── backend/
│   ├── config/          # Database connection
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # API routes (auth, tasks)
│   ├── server.js        # Express server entry point
│   ├── package.json
│   └── docker-compose.yml
└── frontend/
    ├── css/             # Stylesheets
    ├── js/              # Client-side logic
    ├── login.html
    ├── register.html
    └── index.html       # Main dashboard
```

## Prerequisites

- Node.js 18.x or higher
- MongoDB (local installation or Atlas cluster)
- Docker (optional, for containerized setup)

## Local Setup

### Backend

1. Navigate to the backend directory:
```bash
   cd backend
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file with the following variables:
```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key_here
   PORT=3000
```

4. Start the server:
```bash
   npm start
```

   The API will be available at `http://localhost:3000`

### Frontend

The frontend consists of static files. Open `frontend/index.html` in a browser or serve with a local HTTP server:
```bash
npx http-server frontend -c-1
```

### Docker Compose

Run both backend and MongoDB with Docker:
```bash
cd backend
docker-compose up --build
```

This starts:
- MongoDB on port 27017
- Backend API on port 3000

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | List all tasks | No |
| GET | `/api/tasks/my` | List current user's tasks | Yes |
| GET | `/api/tasks/:id` | Get single task | No |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

**Authentication Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

## Deployment on Render

### Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (free tier available)

### MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com
2. Create database user with read/write permissions
3. Network Access: Add `0.0.0.0/0` to IP whitelist
4. Get connection string from "Connect" button

### Render Configuration

1. Create new Web Service on https://render.com
2. Connect your GitHub repository
3. Configure build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. Add environment variables:
```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   JWT_SECRET=your_production_secret_key
   NODE_ENV=production
```

5. Deploy

**Important:**
- URL-encode special characters in MongoDB password (e.g., `!` becomes `%21`)
- Include database name in connection string (`/taskmanager`)
- Render assigns port automatically (typically 10000)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/taskmanager` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `PORT` | Server port (auto-set by Render) | `3000` |
| `NODE_ENV` | Environment mode | `production` |

**Note:** The `.env` file is only used for local development and is ignored in production.

## Development Guidelines

- API responses include `success` boolean and `data` or `error` fields
- Frontend stores JWT in `localStorage`
- CORS enabled for cross-origin requests
- Password minimum length: 6 characters
- Task status values: `todo`, `in-progress`, `done`

## Troubleshooting

**MongoDB connection timeout:**
- Verify `MONGODB_URI` format and credentials
- Check Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database name is included in connection string

**Render deployment fails:**
- Check build logs in Render dashboard
- Verify Root Directory is set to `backend`
- Confirm all environment variables are set

**CORS errors:**
- Verify CORS is enabled in `server.js`
- Check API requests use correct URL

## Testing

**Local:**
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'
```

**Production:**
```bash
# Health check
curl https://task-manager-fullstack-latest-3.onrender.com/api/health
```

## License

MIT License - This project is for educational purposes.

## Author

Created as a learning project to demonstrate:
- RESTful API design
- JWT authentication
- MongoDB database integration
- Full-stack JavaScript development
- Docker containerization
- Cloud deployment with Render