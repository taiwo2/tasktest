import React, { useState, useEffect } from 'react';
import {
  createTask,
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTask
} from './api/tasks';
import './App.css';
import TaskTable from './component/TaskTable';
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTaskNumber, setSelectedTaskNumber] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState('todo'); // default value


  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch all tasks
  const fetchTasks = async () => {
    const allTasks = await getAllTasks();
    setTasks(allTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create Task
  // const handleCreate = async () => {
  //   if (!title.trim() || !dueDate) return;
  //   await createTask({
  //     title,
  //     description: description.trim() || '',
  //     status,
  //     dueDate: new Date(dueDate),
  //   });
  //   setTitle('');
  //   setDescription('');
  //   setDueDate('');
  //   setStatus('');
  //   fetchTasks();
  // };
const handleCreate = async () => {
  try {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (!dueDate) {
      alert('Due date is required');
      return;
    }
    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      alert('Please select a valid status');
      return;
    }
    await createTask({
      title,
      description: description.trim(),
      status,
      dueDate,
    });
    // reset form fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('todo');
    fetchTasks();
  } catch (err) {
    alert(`Failed to create task: ${err.message}`);
  }
};

  // Change status
  const changeStatus = async (id, newStatus) => {
    await updateTaskStatus(id, newStatus);
    fetchTasks();
  };

  // Delete
  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  // Start editing
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate ? new Date(task.dueDate.toDate()).toISOString().slice(0,16) : '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditDescription('');
    setEditDueDate('');
  };

  const saveEdits = async () => {
    if (!editingTaskId) return;
    const updates = {
      description: editDescription,
      dueDate: editDueDate ? new Date(editDueDate) : null,
    };
    await updateTask(editingTaskId, updates);
    setEditingTaskId(null);
    setEditDescription('');
    setEditDueDate('');
    fetchTasks();
  };

  return (
    <div className="app-container">
      <h1>Tasks</h1>

      {/* Create Task Form */}
<div className="task-form">
  {/* First row: Title + Description */}
  <div className="task-form-row">
    <input
      value={title}
      placeholder="Task title (required)"
      onChange={e => setTitle(e.target.value)}
    />
    <input
      value={description}
      placeholder="Description (optional)"
      onChange={e => setDescription(e.target.value)}
    />
  </div>

  {/* Second row: Due Date + Status */}
  <div className="task-form-row">
    <input
      type="datetime-local"
      value={dueDate}
      placeholder="Due date"
      onChange={e => setDueDate(e.target.value)}
    />
    <select
      value={status}
      onChange={e => setStatus(e.target.value)}
    >
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  </div>

  {/* Third row: Create button */}
  <div>
    <button onClick={handleCreate}>Create</button>
  </div>
</div>



      {/* Load task by number */}
      <div className="load-task-number">
        <input
          type="number"
          min="1"
          max={tasks.length}
          value={selectedTaskNumber}
          onChange={e => setSelectedTaskNumber(e.target.value)}
          placeholder={`Enter task number (1-${tasks.length})`}
        />
        <button
          onClick={() => {
            const num = parseInt(selectedTaskNumber, 10);
            if (num >= 1 && num <= tasks.length) {
              setSelectedTask(tasks[num - 1]);
            } else {
              setSelectedTask(null);
            }
          }}
        >
          Load Task By ID Number
        </button>
      </div>

      {selectedTask && (
        <div className="selected-task">
          <h2>Selected Task Details</h2>
          <p><strong>Title:</strong> {selectedTask.title}</p>
          <p><strong>Status:</strong> {selectedTask.status}</p>
          <p><strong>Description:</strong> {selectedTask.description || 'No description'}</p>
          <p><strong>Due:</strong> {selectedTask.dueDate?.toDate?.().toLocaleString() || 'N/A'}</p>
        </div>
      )}

      {/* Task Table */}
       <TaskTable
        tasks={tasks}
        editingTaskId={editingTaskId}
        editDescription={editDescription}
        editDueDate={editDueDate}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        saveEdits={saveEdits}
        changeStatus={changeStatus}
        handleDelete={handleDelete}
        setEditDescription={setEditDescription}
        setEditDueDate={setEditDueDate}
      />
 {editingTaskId && (
  <div className="modal-overlay" onClick={cancelEditing}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3>Edit Task</h3>
      <textarea
        rows={3}
        value={editDescription}
        onChange={e => setEditDescription(e.target.value)}
        placeholder="Edit description"
      />
      <input
        type="datetime-local"
        value={editDueDate}
        onChange={e => setEditDueDate(e.target.value)}
      />
      <div>
        <button className="save-btn" onClick={saveEdits}>Save</button>
        <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
