import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../src/api/tasks';

import { db } from '../src/api/firebase';

import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

jest.mock('../src/api/firebase', () => ({
  db: {}, // fake db export
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: { fromDate: jest.fn(date => date) },
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP')
}));


describe('Tasks API', () => {
  const mockCollectionRef = {};
  const mockDocRef = {};
  
  beforeEach(() => {
    jest.clearAllMocks();
     collection.mockImplementation((dbArg, collectionName) => {
      if (collectionName === 'tasks') {
        return mockCollectionRef;
      }
      return {};
    });
    doc.mockReturnValue(mockDocRef);
  });

  describe('createTask', () => {
    it('should create a task and return id', async () => {
      addDoc.mockResolvedValue({ id: 'abc123' });

      const id = await createTask({
        title: 'Test',
        description: 'desc',
        status: 'todo',
        dueDate: new Date(),
      });

      // Check that addDoc was called with the exact mockCollectionRef and expected data
      expect(addDoc).toHaveBeenCalledWith(
        mockCollectionRef,
        expect.objectContaining({
          title: 'Test',
          description: 'desc',
          status: 'todo',
          dueDate: expect.any(Date),
          createdAt: 'SERVER_TIMESTAMP',
          updatedAt: 'SERVER_TIMESTAMP',
        })
      );
      expect(id).toBe('abc123');
    });
console.log(addDoc.mock.calls);

    it('should throw error if title is empty', async () => {
      await expect(createTask({ title: '', description: '', status: 'todo' })).rejects.toThrow('Title is required');
    });

    it('should throw error if status is invalid', async () => {
      await expect(createTask({ title: 'Test', description: '', status: 'invalid' })).rejects.toThrow('Status must be one of todo, in_progress, done');
    });
  });

  describe('getTaskById', () => {
    it('should return task if exists', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        id: '1',
        data: () => ({ title: 'Task 1', status: 'todo' })
      });

      const task = await getTaskById('1');
      expect(task).toEqual({ id: '1', title: 'Task 1', status: 'todo' });
    });

    it('should return null if task does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false });
      const task = await getTaskById('1');
      expect(task).toBeNull();
    });
  });

  describe('getAllTasks', () => {
    it('should return list of tasks', async () => {
      const docs = [
        { id: '1', data: () => ({ title: 'T1', status: 'todo' }) },
        { id: '2', data: () => ({ title: 'T2', status: 'done' }) }
      ];
      getDocs.mockResolvedValue({ docs });
      query.mockReturnValue('QUERY');

      const tasks = await getAllTasks();
      expect(getDocs).toHaveBeenCalledWith('QUERY');
      expect(tasks).toEqual([
        { id: '1', title: 'T1', status: 'todo' },
        { id: '2', title: 'T2', status: 'done' }
      ]);
    });
  });

  describe('updateTaskStatus', () => {
    it('should call updateDoc with new status', async () => {
      await updateTaskStatus('1', 'done');
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({ status: 'done', updatedAt: 'SERVER_TIMESTAMP' }));
    });

    it('should throw error if status invalid', async () => {
      await expect(updateTaskStatus('1', 'invalid')).rejects.toThrow('Status must be one of todo, in_progress, done');
    });
  });

  describe('updateTask', () => {
    it('should update task fields', async () => {
      const updates = { description: 'updated', dueDate: new Date() };
      await updateTask('1', updates);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({ description: 'updated', dueDate: expect.any(Date), updatedAt: 'SERVER_TIMESTAMP' }));
    });
  });

  describe('deleteTask', () => {
    it('should call deleteDoc', async () => {
      await deleteTask('1');
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });
});
