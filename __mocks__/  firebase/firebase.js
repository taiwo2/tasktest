// Mocks for firebase/app and firebase/auth
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

// Mocks for firebase/firestore including getFirestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
  Timestamp: {
    fromDate: jest.fn(date => `mock-timestamp-${date}`),
  },
  query: jest.fn(),
  getFirestore: jest.fn(() => ({})),
}));
