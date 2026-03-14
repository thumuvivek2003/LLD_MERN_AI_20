# MERN User Authentication & Admin Management System

A production-style **authentication and user management system** built with the **MERN stack**.
The project demonstrates **clean architecture, layered backend design, role-based authorization, and security features** such as rate limiting and token revocation.

The system supports **user authentication, JWT security, admin user management, and protected frontend routes**.

---

# Features

### Authentication

* User Signup
* User Login
* Password hashing with bcrypt
* JWT based authentication
* Protected API routes

### Authorization

* Role based access control
* Admin-only routes
* Route guards in frontend

### Admin User Management

Admin can:

* View all users
* Create users
* Update name, email, password
* Change role (user / admin)
* Delete users

### Security

* Rate limiting on login (brute force protection)
* Token blacklist (logout token revocation)
* Password hashing
* JWT verification middleware

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

## Frontend

* React
* React Router
* Axios
* Context API

---

# Backend Architecture

The backend follows a **layered architecture**.

```
Route → Controller → Service → Repository → Database
```

### Folder Structure

```
src
 ├ config
 │   └ db.js
 │
 ├ models
 │   ├ User.js
 │   └ BlacklistedToken.js
 │
 ├ repositories
 │   └ UserRepository.js
 │
 ├ services
 │   ├ AuthService.js
 │   └ TokenBlacklistService.js
 │
 ├ controllers
 │   └ AuthController.js
 │
 ├ middleware
 │   ├ authMiddleware.js
 │   ├ roleMiddleware.js
 │   ├ rateLimitMiddleware.js
 │   └ tokenBlacklistMiddleware.js
 │
 ├ routes
 │   ├ authRoutes.js
 │   └ userRoutes.js
 │
 ├ utils
 │   ├ jwt.js
 │   └ hash.js
 │
 └ server.js
```

---

# Frontend Architecture

Frontend follows **component-based architecture with service layer**.

```
src
 ├ api
 │   └ axiosClient.js
 │
 ├ services
 │   ├ authService.js
 │   └ userService.js
 │
 ├ context
 │   └ AuthContext.js
 │
 ├ hooks
 │   └ useAuth.js
 │
 ├ components
 │   ├ LoginForm.jsx
 │   ├ SignupForm.jsx
 │   ├ UserTable.jsx
 │   ├ UserForm.jsx
 │   └ ProtectedRoute.jsx
 │
 ├ pages
 │   ├ LoginPage.jsx
 │   ├ SignupPage.jsx
 │   ├ Dashboard.jsx
 │   └ AdminDashboard.jsx
 │
 ├ routes
 │   └ AppRoutes.jsx
 │
 ├ utils
 │   └ tokenStorage.js
 │
 ├ App.jsx
 └ main.jsx
```

---

# Security Flow

### Login

```
Client
  ↓
RateLimiter
  ↓
AuthController
  ↓
AuthService
  ↓
JWT Generated
```

### Protected APIs

```
Client
  ↓
AuthMiddleware
  ↓
TokenBlacklistMiddleware
  ↓
RoleMiddleware
  ↓
Controller
```

---

# API Endpoints

### Authentication

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

### User

```
GET /api/users/profile
```

### Admin

```
GET    /api/users/users
POST   /api/users/users
PUT    /api/users/users/:id
DELETE /api/users/users/:id
```

---

# Future Improvements

* Refresh token authentication
* Token rotation
* Pagination for user list
* Search users
* Activity logs
* Account lock after failed login attempts

---

# Author

Built to demonstrate **production-style authentication architecture using MERN stack and clean layered design**.

```
Frontend
 ↓
API Layer
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```
