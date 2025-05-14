# 📊 Task Management Collaboration Platform - Creative Upaay Internship Challenge

**Comprehensive task management system** developed for the **Creative Upaay Web Development Internship Assessment**. This solution offers a collaborative workspace where teams can organize tasks, track events, and manage subtasks with live updates, deadline notifications, and intuitive drag-and-drop functionality.

## 💫 Solution Highlights

The platform enables users to:

- **Create**, **remove**, and **modify** events, tasks, and subtasks
- Transition tasks between **To Do**, **On Progress**, and **Done** states using **drag-and-drop**
- Receive alerts for tasks that are **past deadline** or **approaching due dates**
- Experience **live updates** through **WebSocket technology**
- Benefit from persistent application state via **Redux and LocalStorage**
- Access securely with **JWT authentication**

> ✨ Successfully delivered all **Level 1** requirements plus **5 out of 7 Level 2 optional features** as specified in the assignment brief.

---

## 🔧 Technology Architecture

### Client Side

- **React.js** framework
- **Tailwind CSS** framework for adaptive interface design
- **Redux** ecosystem for state orchestration
- **LocalStorage** integration for state persistence
- **Framer Motion** library for interface animations (where applicable)

### Server Side

- **Node.js** runtime with **Express.js** framework
- **Prisma ORM** for database operations
- **PostgreSQL** database system
- **JWT** implementation for secure authentication
- **Socket.IO** library for bidirectional communication
- Deployment provided through Render

---

## 📝 Data Structure

- `User` entity
- `Event` entity → linked to `userId` (Foreign Key)
- `Task` entity → linked to `eventId` (Foreign Key)
- `Subtask` entity → linked to `taskId` (Foreign Key)

---

## ⭐ Implemented Capabilities

### ✅ Level 1 Requirements - Completed

- [x] Responsive interface based on [Figma](https://www.figma.com/design/2joKVlIEH43PfO9pFfsX51/DASHBOARD-DESIGN-TASK---CREATIVE-UPAAY?node-id=0-1&t=ShcwKcmHcyTqLA5T-1) specifications
- [x] Task creation and removal functionality
- [x] Status transitions between columns
- [x] Task filtering mechanisms
- [x] State management through Redux with LocalStorage
- [x] Drag-and-drop interaction

### 🌠 Level 2 Enhancements - Completed

- [x] **JWT Authentication** – Login/signup secured through HTTP protocols
- [x] **Due Date & Reminder** – Deadline notifications for time-sensitive tasks
- [x] **Subtasks** – Hierarchical task organization
- [x] **Socket.IO Integration** – Instantaneous updates across all components
- [x] **Drag-and-drop** (featured in both requirement levels)

> 🔍 Features not implemented: Customizable Task Fields, Activity Logging

---

> Application deployed at:

> ⚠️ Performance Notice
> Free-tier hosting services (Vercel and Render) may introduce latency and cold-start delays that affect the application's responsiveness.
> For optimal performance evaluation, running the application locally is recommended by following the instructions below.

### Project Live Link: https://taskboard-eosin.vercel.app/

### 1. Clone the backend Repository - run locally

```bash
git clone https://github.com/yash-parekh715/taskboard-backend.git
cd taskboard-backend
npm install
```

create a .env file with the variables

- DATABASE_URL - url of the online/local postgres data base you want to use.
- JWT_SECRET - secret key value

```bash
npx prisma migrate dev --name initial_migration
npm run start
```

### 2. Clone the frontend Repository - run locally

```bash
git clone https://github.com/yash-parekh715/taskboard-frontend.git
cd taskboard-frontend
npm install
```

create a .env file with the variables

- VITE_API_AUTH_URL - url for where your backend is hosted / listening for login, signup requests.
- VITE_SOCKET_URL - url for where your socket interacts.

```bash
npm run dev
```
