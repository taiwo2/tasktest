import React from 'react';

export default function TaskTable({
  tasks,
  editingTaskId,
  editDescription,
  editDueDate,
  startEditing,
  cancelEditing,
  saveEdits,
  changeStatus,
  handleDelete,
  setEditDescription,
  setEditDueDate,
}) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Status</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t, index) => (
          <tr key={t.id}>
            <td>{index + 1}</td>
            <td>{t.title}</td>
            <td>
              <button
                className={`status-btn status-todo ${t.status === 'todo' ? 'selected' : 'dimmed'}`}
                onClick={() => changeStatus(t.id, 'todo')}
              >
                To Do
              </button>
              <button
                className={`status-btn status-in_progress ${t.status === 'in_progress' ? 'selected' : 'dimmed'}`}
                onClick={() => changeStatus(t.id, 'in_progress')}
              >
                In Progress
              </button>
              <button
                className={`status-btn status-done ${t.status === 'done' ? 'selected' : 'dimmed'}`}
                onClick={() => changeStatus(t.id, 'done')}
              >
                Done
              </button>
            </td>

            <td>
              {editingTaskId === t.id ? (
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
              ) : t.description || 'No description'}
            </td>

            <td>
              {editingTaskId === t.id ? (
                <input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                />
              ) : t.dueDate?.toDate?.().toLocaleString() || 'N/A'}
            </td>

            <td>
              {editingTaskId === t.id ? (
                <div className="edit-area">
                  <button onClick={saveEdits}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <>
                  <button onClick={() => startEditing(t)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="delete-btn">Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
