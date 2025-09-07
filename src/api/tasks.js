
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, orderBy, serverTimestamp, Timestamp, query } from 'firebase/firestore';
import { db } from './firebase';

const tasksCol = collection(db, 'tasks');


export async function createTask({ title, description, status, dueDate }) {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Title is required and must be a non-empty string');
  }
  if (typeof description !== 'string') {
    throw new Error('Description must be a string');
  }
  const validStatuses = ['todo', 'in_progress', 'done'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Status must be one of ${validStatuses.join(', ')}`);
  }
  let dueTimestamp;
  try {
    dueTimestamp = dueDate ? Timestamp.fromDate(new Date(dueDate)) : serverTimestamp();
  } catch {
    throw new Error('Invalid dueDate format');
  }

  const data = {
    title: title.trim(),
    description: description || '',
    status,
    dueDate: dueTimestamp,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    // Move the collection reference creation inside the function
    const tasksCol = collection(db, 'tasks'); 
    const ref = await addDoc(tasksCol, data);
    return ref.id;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
}
export async function getTaskById(id) {
  try {
    const ref = doc(db, 'tasks', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.error('Get task by ID error:', error);
    throw error;
  }
}

export async function getAllTasks() {
  try {
    const q = query(tasksCol, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Get all tasks error:', error);
    throw error;
  }
}

export async function updateTaskStatus(id, status) {
  const validStatuses = ['todo', 'in_progress', 'done'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Status must be one of ${validStatuses.join(', ')}`);
  }
  try {
    const ref = doc(db, 'tasks', id);
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Update task status error:', error);
    throw error;
  }
}

export async function updateTask(id, updates) {
  try {
    const cleanUpdates = { ...updates };
    if ('dueDate' in cleanUpdates) {
      cleanUpdates.dueDate = cleanUpdates.dueDate ? Timestamp.fromDate(new Date(cleanUpdates.dueDate)) : null;
    }
    const ref = doc(db, 'tasks', id);
    await updateDoc(ref, { ...cleanUpdates, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
}

export async function deleteTask(id) {
  try {
    const ref = doc(db, 'tasks', id);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
}
