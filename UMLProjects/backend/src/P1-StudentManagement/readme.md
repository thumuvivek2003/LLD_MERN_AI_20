# Student Management System - Backend API

A comprehensive RESTful API for managing students, courses, marks, and attendance built with Node.js, Express, and MongoDB.

## Features

- ✅ Student Management (CRUD operations)
- ✅ Course Management (CRUD operations)
- ✅ Marks Management with grade calculation
- ✅ Attendance Tracking with percentage calculation
- ✅ Search and filter functionality
- ✅ Error handling middleware
- ✅ MongoDB integration with Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd student-management-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/student_management
NODE_ENV=development
```

4. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. **Run the server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/search/query?q=name` | Search students |
| GET | `/api/students/status/:status` | Get students by status |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| GET | `/api/courses/search/query?q=name` | Search courses |
| GET | `/api/courses/status/:status` | Get courses by status |
| GET | `/api/courses/code/:code` | Get course by code |

### Marks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marks` | Get all marks |
| GET | `/api/marks/:id` | Get marks by ID |
| POST | `/api/marks` | Create new marks |
| PUT | `/api/marks/:id` | Update marks |
| DELETE | `/api/marks/:id` | Delete marks |
| GET | `/api/marks/student/:studentId` | Get marks by student |
| GET | `/api/marks/course/:courseId` | Get marks by course |
| GET | `/api/marks/student/:studentId/average` | Get student average |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get all attendance |
| GET | `/api/attendance/:id` | Get attendance by ID |
| POST | `/api/attendance` | Create new attendance |
| PUT | `/api/attendance/:id` | Update attendance |
| DELETE | `/api/attendance/:id` | Delete attendance |
| GET | `/api/attendance/student/:studentId` | Get attendance by student |
| GET | `/api/attendance/course/:courseId` | Get attendance by course |
| GET | `/api/attendance/date/:date` | Get attendance by date |
| GET | `/api/attendance/student/:studentId/percentage` | Get attendance percentage |
| GET | `/api/attendance/range/dates?startDate=&endDate=` | Get by date range |

## Request Examples

### Create Student
```json
POST /api/students
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "course": "Computer Science"
}
```

### Create Course
```json
POST /api/courses
{
  "name": "Data Structures",
  "code": "CS101",
  "instructor": "Dr. Smith",
  "credits": 4,
  "duration": "3 months",
  "description": "Introduction to data structures"
}
```

### Create Marks
```json
POST /api/marks
{
  "studentId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "studentName": "John Doe",
  "course": "Data Structures",
  "marks": 85,
  "maxMarks": 100,
  "grade": "A"
}
```

### Create Attendance
```json
POST /api/attendance
{
  "studentId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "studentName": "John Doe",
  "course": "Data Structures",
  "date": "2024-01-15",
  "status": "Present"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Project Structure

```
src/
├── server.js              # Entry point
├── app.js                 # Express app configuration
├── config/
│   └── db.js             # Database configuration
├── models/               # Mongoose models
├── controllers/          # Request handlers
├── services/             # Business logic
├── routes/               # API routes
└── middlewares/          # Custom middleware
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Development

The project uses ES6 modules. Make sure your `package.json` has `"type": "module"`.

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Duplicate entries
- Invalid IDs
- Database errors
- General server errors

## License

ISC

## Author

Your Name

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.