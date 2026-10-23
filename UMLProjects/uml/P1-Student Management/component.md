## 🔷 1. System Architecture (Frontend ↔ Backend)

```mermaid
flowchart LR
    A[React Frontend] -->|HTTP Requests| B[Express Backend]
    B --> C[MongoDB Database]

    subgraph Frontend
        A1[Pages<br/>Login, Dashboard,<br/>Students, Courses,<br/>Marks, Attendance]
        A2[Components<br/>Navbar, Sidebar,<br/>StudentCard, CourseCard]
        A3[Services<br/>student.service.js<br/>course.service.js<br/>marks.service.js<br/>attendance.service.js]
        A4[Hooks<br/>useFetch.js]
        A5[API Layer<br/>api.js]
    end

    subgraph Backend
        B1[Routes<br/>student.routes.js<br/>course.routes.js<br/>marks.routes.js<br/>attendance.routes.js]
        B2[Controllers<br/>student.controller.js<br/>course.controller.js<br/>marks.controller.js<br/>attendance.controller.js]
        B3[Services<br/>student.service.js<br/>course.service.js<br/>marks.service.js<br/>attendance.service.js]
        B4[Models<br/>student.model.js<br/>course.model.js<br/>marks.model.js<br/>attendance.model.js]
        B5[Middleware<br/>error.middleware.js]
        B6[DB Config<br/>db.js]
    end

    A --> A1
    A --> A2
    A --> A3
    A --> A4
    A3 --> A5

    B --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B --> B5
    B --> B6
```

---

## 🔷 2. Backend UML Class Diagram

This shows relationships between your backend layers.

```mermaid
classDiagram

    class Student {
        +String id
        +String name
        +String email
        +String department
    }

    class Course {
        +String id
        +String title
        +String code
        +Integer credit
    }

    class Marks {
        +String id
        +Student student
        +Course course
        +Integer marks
    }

    class Attendance {
        +String id
        +Student student
        +Course course
        +Boolean present
        +Date date
    }

    class StudentController {
        +createStudent()
        +getStudents()
        +getStudentById()
        +updateStudent()
        +deleteStudent()
    }

    class CourseController {
        +createCourse()
        +getCourses()
        +updateCourse()
        +deleteCourse()
    }

    class MarksController {
        +assignMarks()
        +getMarks()
    }

    class AttendanceController {
        +markAttendance()
        +getAttendance()
    }

    class StudentService {
        +addStudent()
        +fetchStudents()
    }

    class CourseService {
        +addCourse()
        +fetchCourses()
    }

    class MarksService {
        +addMarks()
        +fetchMarks()
    }

    class AttendanceService {
        +markAttendance()
        +fetchAttendance()
    }

    StudentController --> StudentService
    CourseController --> CourseService
    MarksController --> MarksService
    AttendanceController --> AttendanceService

    StudentService --> Student
    CourseService --> Course
    MarksService --> Marks
    AttendanceService --> Attendance

    Marks --> Student
    Marks --> Course

    Attendance --> Student
    Attendance --> Course
```

---

## 🔷 3. Frontend Component Structure (Optional)

```mermaid
classDiagram
    class App {
        +render()
    }

    class Navbar
    class Sidebar
    class StudentCard
    class CourseCard

    class Dashboard
    class Students
    class Courses
    class Marks
    class Attendance
    class Login

    App --> Navbar
    App --> Sidebar
    App --> Dashboard
    App --> Students
    App --> Courses
    App --> Marks
    App --> Attendance
    App --> Login

    Students --> StudentCard
    Courses --> CourseCard

    Dashboard --> StudentCard
    Dashboard --> CourseCard
```


```code
student-management-frontend/
│
├── public/
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StudentCard.jsx
│   │   ├── CourseCard.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Courses.jsx
│   │   ├── Marks.jsx
│   │   └── Attendance.jsx
│
│   ├── services/
│   │   ├── api.js
│   │   ├── student.service.js
│   │   ├── course.service.js
│   │   ├── marks.service.js
│   │   └── attendance.service.js
│
│   ├── styles/
│   │   └── app.css
│
│   └── hooks/
│       └── useFetch.js
│
└── package.json




student-management-backend/
│
├── src/
│   ├── server.js
│   ├── app.js
│
│   ├── config/
│   │   └── db.js
│
│   ├── models/
│   │   ├── student.model.js
│   │   ├── course.model.js
│   │   ├── marks.model.js
│   │   └── attendance.model.js
│
│   ├── controllers/
│   │   ├── student.controller.js
│   │   ├── course.controller.js
│   │   ├── marks.controller.js
│   │   └── attendance.controller.js
│
│   ├── services/
│   │   ├── student.service.js
│   │   ├── course.service.js
│   │   ├── marks.service.js
│   │   └── attendance.service.js
│
│   ├── routes/
│   │   ├── student.routes.js
│   │   ├── course.routes.js
│   │   ├── marks.routes.js
│   │   └── attendance.routes.js
│
│   └── middlewares/
│       └── error.middleware.js
│
├── .env
├── package.json hi give me UML language using best mermaid diagram , but correct syntax  