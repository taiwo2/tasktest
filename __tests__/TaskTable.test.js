import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TaskTable from '../src/component/TaskTable';

describe('TaskTable Component', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      status: 'todo',
      description: 'Desc 1',
      dueDate: { toDate: () => new Date('2025-01-01T12:00:00Z') },
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'done',
      description: '',
      dueDate: null,
    },
  ];

  const mockFns = {
    changeStatus: jest.fn(),
    startEditing: jest.fn(),
    cancelEditing: jest.fn(),
    saveEdits: jest.fn(),
    handleDelete: jest.fn(),
    setEditDescription: jest.fn(),
    setEditDueDate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders tasks with correct data', () => {
    render(
      <TaskTable
        tasks={mockTasks}
        editingTaskId={null}
        editDescription=""
        editDueDate=""
        {...mockFns}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getAllByText('No description').length).toBe(1);
    expect(
      screen.getByText(new Date('2025-01-01T12:00:00Z').toLocaleString())
    ).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('status buttons get correct classes and fire changeStatus', () => {
    render(
      <TaskTable
        tasks={mockTasks}
        editingTaskId={null}
        editDescription=""
        editDueDate=""
        {...mockFns}
      />
    );

    // Task 1 row buttons
    const task1Row = screen.getByText('Task 1').closest('tr');
    const todoBtnTask1 = within(task1Row).getByText('To Do');
    const doneBtnTask1 = within(task1Row).getByText('Done');

    expect(todoBtnTask1).toHaveClass('selected');
    expect(doneBtnTask1).toHaveClass('dimmed');

    // Task 2 row buttons
    const task2Row = screen.getByText('Task 2').closest('tr');
    const doneBtnTask2 = within(task2Row).getByText('Done');
    const todoBtnTask2 = within(task2Row).getByText('To Do');

    expect(doneBtnTask2).toHaveClass('selected');
    expect(todoBtnTask2).toHaveClass('dimmed');

    fireEvent.click(todoBtnTask1);
    expect(mockFns.changeStatus).toHaveBeenCalledWith('1', 'todo');

    fireEvent.click(doneBtnTask2);
    expect(mockFns.changeStatus).toHaveBeenCalledWith('2', 'done');
  });

  test('shows edit inputs and buttons, and handlers work', () => {
    render(
      <TaskTable
        tasks={mockTasks}
        editingTaskId="1"
        editDescription="edit desc"
        editDueDate="2025-02-01T12:00"
        {...mockFns}
      />
    );

    const textarea = screen.getByDisplayValue('edit desc');
    const datetimeInput = screen.getByDisplayValue('2025-02-01T12:00');
    expect(textarea).toBeInTheDocument();
    expect(datetimeInput).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'new desc' } });
    expect(mockFns.setEditDescription).toHaveBeenCalledWith('new desc');

    fireEvent.change(datetimeInput, { target: { value: '2025-03-01T15:00' } });
    expect(mockFns.setEditDueDate).toHaveBeenCalledWith('2025-03-01T15:00');

    fireEvent.click(screen.getByText('Save'));
    expect(mockFns.saveEdits).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockFns.cancelEditing).toHaveBeenCalled();
  });

  test('shows Edit and Delete buttons and handlers fire', () => {
    render(
      <TaskTable
        tasks={mockTasks}
        editingTaskId={null}
        editDescription=""
        editDueDate=""
        {...mockFns}
      />
    );

    const editButton = screen.getAllByText('Edit')[0];
    const deleteButton = screen.getAllByText('Delete')[0];

    fireEvent.click(editButton);
    expect(mockFns.startEditing).toHaveBeenCalledWith(mockTasks[0]);

    fireEvent.click(deleteButton);
    expect(mockFns.handleDelete).toHaveBeenCalledWith('1');
  });
});
