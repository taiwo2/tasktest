import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

// Mock API functions
jest.mock('../src/api/tasks', () => ({
  createTask: jest.fn(),
  getAllTasks: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
  updateTask: jest.fn(),
}));

import { createTask, getAllTasks, deleteTask, updateTaskStatus } from '../src/api/tasks';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays tasks on mount', async () => {
    getAllTasks.mockResolvedValue([
      { id: '1', title: 'Test Task', status: 'todo', description: 'desc', dueDate: null },
    ]);
    render(<App />);
    expect(getAllTasks).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText('Test Task')).toBeInTheDocument());
  });

  test('successful task creation resets form and reloads tasks', async () => {
    getAllTasks.mockResolvedValue([]);
    createTask.mockResolvedValue();

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/task title/i), 'New Task');
    await user.type(screen.getByPlaceholderText(/description/i), 'Task description');

    const dueDateInput = screen.getByPlaceholderText(/due date/i);
    await user.clear(dueDateInput);
    await user.type(dueDateInput, '2025-12-31T12:00');

    await user.selectOptions(screen.getByRole('combobox'), ['todo']);

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
        status: 'todo',
        dueDate: '2025-12-31T12:00',
      });
    });

    // Assert inputs are cleared
    expect(screen.getByPlaceholderText(/task title/i).value).toBe('');
    expect(screen.getByPlaceholderText(/description/i).value).toBe('');
    expect(dueDateInput.value).toBe('');
  });

  test('changing status calls updateTaskStatus and reloads tasks', async () => {
    const tasks = [{ id: '1', title: 'Test Task', status: 'todo', description: '', dueDate: null }];
    getAllTasks.mockResolvedValue(tasks);
    updateTaskStatus.mockResolvedValue();

    render(<App />);
    await waitFor(() => screen.getByText('Test Task'));

    const doneButton = screen.getByRole('button', { name: /done/i });
    const user = userEvent.setup();
    await user.click(doneButton);

    expect(updateTaskStatus).toHaveBeenCalledWith('1', 'done');
  });

  test('delete button calls deleteTask and reloads tasks', async () => {
    const tasks = [{ id: '1', title: 'Test Task', status: 'todo', description: '', dueDate: null }];
    getAllTasks.mockResolvedValue(tasks);
    deleteTask.mockResolvedValue();

    render(<App />);
    await waitFor(() => screen.getByText('Test Task'));

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    expect(deleteTask).toHaveBeenCalledWith('1');
  });
});
