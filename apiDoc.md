***

# Tasks API Documentation

## Overview
This API provides CRUD (Create, Read, Update, Delete) operations for managing tasks in a Firebase Firestore database. All endpoints return Promises and include comprehensive error handling.

## Base URL
All endpoints interact with the Firebase Firestore database at the tasks collection.

***

## Functions

### `createTask({ title, description, status, dueDate })`

Creates a new task document.

- **Parameters:**
    - `title` (string, required): Task title, non-empty string.
    - `description` (string, optional): Task description, defaults to empty string.
    - `status` (string, required): One of `"todo"`, `"in_progress"`, `"done"`.
    - `dueDate` (Date or string, optional): Due date; stored as Firestore timestamp. If omitted, current server time is used.
- **Returns:**
    - Promise resolving to the string ID of the newly created task document.
- **Throws:**
    - Error if title is missing or invalid.
    - Error if description is not a string.
    - Error if status is invalid.
    - Error if dueDate cannot be parsed.

***

### `getTaskById(id)`

Fetches a task document by its ID.

- **Parameters:**
    - `id` (string, required): Firestore document ID.
- **Returns:**
    - Promise resolving to an object representing the task with fields including `id`, `title`, `description`, `status`, `dueDate`, or `null` if not found.
- **Throws:**
    - Error if Firestore fetch fails.

***

### `getAllTasks()`

Fetches all tasks ordered by creation timestamp ascending.

- **Returns:**
    - Promise resolving to an array of task objects, each having fields including `id`, `title`, `description`, `status`, and `dueDate`.
- **Throws:**
    - Error if Firestore query fails.

***

### `updateTaskStatus(id, status)`

Updates the status field of an existing task.

- **Parameters:**
    - `id` (string, required): Firestore document ID.
    - `status` (string, required): One of `"todo"`, `"in_progress"`, `"done"`.
- **Returns:**
    - Promise resolving when update completes.
- **Throws:**
    - Error if status is invalid.
    - Error if Firestore update fails.

***

### `updateTask(id, updates)`

Updates multiple fields of an existing task.

- **Parameters:**
    - `id` (string, required): Firestore document ID.
    - `updates` (object, required): Fields to update. `dueDate` should be a Date or string if present.
- **Returns:**
    - Promise resolving when update completes.
- **Throws:**
    - Error if Firestore update fails.

***

### `deleteTask(id)`

Deletes the task document by ID.

- **Parameters:**
    - `id` (string, required): Firestore document ID.
- **Returns:**
    - Promise resolving when deletion completes.
- **Throws:**
    - Error if Firestore delete fails.

***

## Firestore Notes

- Tasks are stored in the `tasks` collection under the root Firestore database.
- Dates are stored using Firestore `Timestamp` objects created from JavaScript Date.
- The API uses Firestore server timestamps for `createdAt` and `updatedAt`.
- Queries order tasks by `createdAt` ascending to retrieve tasks in creation order.

***

## Example Usage

```js
import { createTask, getTaskById, getAllTasks, updateTaskStatus, updateTask, deleteTask } from './api/tasks';

// Create Task
const id = await createTask({ title: 'My Task', description: 'Desc', status: 'todo', dueDate: new Date() });

// Get Task
const task = await getTaskById(id);

// List Tasks
const tasks = await getAllTasks();

// Update Status
await updateTaskStatus(id, 'done');

// Update Multiple Fields
await updateTask(id, { description: 'New desc', dueDate: new Date() });

// Delete Task
await deleteTask(id);
```


***

This documentation summarizes the purpose, parameters, return values, and errors for all task API endpoints.


