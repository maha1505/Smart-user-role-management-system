# User Role Management System

A full-stack Corporate HR Management System built with the MERN stack
featuring Role-Based Access Control (RBAC) for 5 roles —
Admin, Manager, Employee, HR and Accountant.

## Tech Stack
- Frontend: React.js + Vite, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + Bcrypt.js
- API: Axios + RESTful API

## Roles
| Role | Access |
|------|--------|
| Admin | Full system control |
| Manager | Team & task management |
| Employee | Tasks & leave |
| HR | Records & leave approval |
| Accountant | Payroll & reports |

## Installation

### Clone the repository
git clone https://github.com/yourusername/hr-role-management.git
cd hr-role-management

### Setup Backend
cd server
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev

### Setup Frontend
cd client
npm install
cp .env.example .env
# Fill in your API base URL in .env
npm run dev

## Folder Structure
- /client — React + Vite frontend
- /server — Node + Express backend

## Deployment
- Frontend: Vercel
- Backend: Render

## Features
- Admin-controlled registration approval
- JWT authentication with role-based routing
- 2-stage leave approval workflow
- Task assignment and progress tracking
- Payroll generation and management
- Complete audit logging
