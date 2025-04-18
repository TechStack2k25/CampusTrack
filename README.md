# 📚 Campus Track

A secure and scalable full-stack academic management platform with real-time communication, role-based access control, and analytics for college-level administration.

---

## 🌐 Live Demo
[Coming Soon]

## 🛠 Tech Stack

- **Frontend**: React.js, React Hook Form, React Query, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Google OAuth, JWT
- **Real-time Communication**: Socket.IO
- **Email Services**: SendGrid

---

## ✅ Features

### 🔐 Authentication & User Management
- Google OAuth and email/password login
- Two-Step Verification (2FA)
- Account verification and password reset via **SendGrid**

### 👥 Role-Based Hierarchy
- Website Admin → College Admin → Head of Department → Faculty → Students
- Role-specific dashboards, permissions, and access control

### 👥 User Roles
#### Student:
- View and update personal profile.
- Request course addition or enrollment
#### Faculty:
- Same as students with additional permissions
#### HOD:
- Approve/reject requests from students/faculty
- Request to add new users under their department
- Add Courses to department
#### Admin:
- Full system control (all requests, users, courses)

### 📘 Academic Modules
- **Course-wise Attendance Tracking**
- **Assignment Upload & Submission**
- **Courses respective Study Material Store**
- **Event & Schedule Management**

### 💬 Real-Time Communication (Socket.IO)
- College Group: Only Admin can send messages
- Courses: Faculty-only messaging
- Departments: Only HoD can communicate
- Real-time updates & socket rooms per role

### 📊 Admin Analytics
- Total students, faculty, departments overview
- Automated emails on college creation and deletion

