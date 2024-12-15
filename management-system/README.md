# Vue Task Management System

This is a **Vue 3 + Vite** task management system with drag-and-drop functionality, sorting options, persistent storage using `localStorage`, and a backend API simulation through `JSON Server`. The project allows for managing tasks and projects dynamically with notifications for CRUD operations.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Simulation](#api-simulation)
7. [Key Functionality](#key-functionality)
8. [Requirements Review](#requirements-review)
9. [Technologies Used](#technologies-used)
10. [License](#license)

---

## Project Overview

The **Task Management System** enables users to:

- Manage tasks and projects dynamically.
- Sort tasks and projects based on various parameters.
- Reorder tasks with drag-and-drop and persist order across page refresh.
- Resize table columns dynamically.
- Navigate to project details on row click.
- Use modals for adding and editing tasks or projects.
- Receive notifications for task and project operations.
- Store data persistently using a mock backend API (**db.json**) powered by JSON Server.

---

## Features

1. **Project Management**

   - Add, Edit, and Delete projects using modals.
   - Sort projects by `ID`, `Name`, `Status`, and `Task Count`.
   - Task count updates automatically when tasks are added or deleted.
   - Navigate to project details by clicking on a project row.

2. **Task Management**

   - Add, Edit, and Delete tasks for specific projects using modals.
   - Sort tasks by `ID`, `Name`, `Executor`, `Status`, and `Due Date`.
   - Drag-and-drop tasks to reorder and persist order across page refresh.

3. **Persistent State**

   - Task sorting and ordering preferences are saved to **localStorage**.
   - Task orders are restored after refreshing the page.
   - Sorting options persist after any updates.

4. **Push Notifications**

   - User-friendly notifications for successful and failed CRUD operations.

5. **Table Column Resizing**

   - Dynamically resize columns in the table for better usability.

6. **Mock Backend API**

   - Simulated RESTful API using JSON Server.

---

## Folder Structure

```plaintext
management-system/
├── public/                       # Static assets
├── src/
│   ├── api/                      # API services (fetch, create, update, delete)
│   │   └── index.ts              # API initialization
│   │   └── tasks.ts              # Task API services
│   ├── assets/                   # Static assets (scss, styles)
│   │   └── main.scss             # SCSS styles
│   ├── components/               # Reusable Vue components
│   │   ├── AddProject.vue        # Add/Edit Project Modal
│   │   ├── AddTask.vue           # Add/Edit Task Modal
│   │   ├── PushNotification.vue  # Notification component
│   ├── router/                   # Vue Router configuration
│   │   └── index.ts              # Router configuration file
│   ├── stores/                   # Pinia stores
│   │   ├── projectsStore.ts      # Store for projects
│   │   ├── tasksStore.ts         # Store for tasks
│   ├── types/                    # TypeScript types
│   │   ├── project.ts
│   │   ├── task.ts
│   ├── utils/                    # Utility functions
│   │   ├── dragAndDrop.ts        # Drag-and-drop logic
│   │   ├── useNotification.ts    # Custom notification composable
│   │   ├── setUpResizableColumns.ts # Column resizing logic
│   ├── views/                    # Views for routing
│   │   ├── ProjectsView.vue      # Project List View
│   │   ├── ProjectDetails.vue    # Task List View
│   ├── App.vue                   # Main app component
│   ├── main.ts                   # Vue app entry point
│   ├── vite.config.ts            # Vite configuration
├── db.json                       # Mock backend API (JSON Server)
├── package.json                  # Project dependencies
├── README.md                     # Project documentation
└── tsconfig.json                 # TypeScript configuration
```

---

## Installation

### Prerequisites

Ensure the following tools are installed:

- **Node.js** (v14+)
- **npm** or **Yarn**

### Steps

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the mock backend server with JSON Server:

   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser:

   ```
   http://localhost:5173
   ```

---

## Usage

### Managing Projects

1. **Add a Project**: Click the "Add Project" button to open a modal.
2. **Edit a Project**: Use the "Edit" button in the project table.
3. **Delete a Project**: Click the "Delete" button and confirm.
4. **Navigate to Project Page**: Click on a project row to view its tasks.

### Managing Tasks

1. **Add a Task**: Click the "Add Task" button in a specific project view.
2. **Edit a Task**: Use the "Edit" button next to each task.
3. **Delete a Task**: Click the "Delete" button next to each task.
4. **Drag-and-Drop**: Reorder tasks and persist the order after page refresh.

### Sorting

- Sort tasks and projects by clicking the respective sort buttons.
- Sorting preferences persist after page refresh.

### Resizing Columns

- Resize table columns by dragging the edge of column headers.

---

## Key Functionality

1. **Drag-and-Drop Tasks**:

   - Drag a task and drop it to a new position.
   - The task order is saved in **localStorage** and restored after a page refresh.

2. **Sort Tasks and Projects**:

   - Sort by `ID`, `Name`, `Status`, `Due Date`, and `Task Count`.
   - Sorting preferences are saved and persist after refresh.

3. **Dynamic Column Resizing**:

   - Users can resize table columns for improved layout control.

4. **Push Notifications**:

   - A reusable `PushNotification` component provides success/error messages for all CRUD operations.

5. **Persistent State**:

   - Task and project sorting preferences persist in `localStorage`.
   - Task drag-and-drop order is saved and restored.

6. **Modals**:

   - Modals are used for adding and editing projects or tasks.

---

## Requirements Review

All requested functionality has been implemented:

1. **Sorting options persist** after updates and page refresh.
2. **Drag-and-drop ordering** persists after refreshing the page.
3. **Column resizing** is supported.
4. **Navigation to project details** works on row click.
5. **Notifications** for task and project operations are displayed.
6. **Modals** handle adding and editing tasks or projects seamlessly.
7. Task count updates dynamically when tasks are added or deleted.
8. API requests simulate CRUD operations using `JSON Server`.

---

## Technologies Used

- **Vue 3** with Composition API
- **Vite** for fast development builds
- **Pinia** for state management
- **TypeScript** for type safety
- **JSON Server** for simulating a backend
- **LocalStorage** for persistent sorting and task ordering

---


## License

This project is licensed under the **MIT License**.

