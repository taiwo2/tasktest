
# Firebase Tasks App

This project is a full-stack web application for creating, viewing, editing, and deleting tasks using **React** on the frontend and **Firebase Firestore** as the backend.. The app lets users create, view, update, and delete tasks with due dates and status tracking.  It demonstrates clean API design, robust validation, and scalable front-end architecture.
## Preview
* ![Home](/demo.png)
## Features

- Add new tasks with title, description, due date, and status (`todo`, `in_progress`, `done`)
- Create, update, delete, and list tasks with support for descriptions, due dates, and status tracking
- Edit task description and due date
- Real-time data storage and retrieval with Firestore
- Robust input validation and error handling at the API layer
- All data stored in Firebase Firestore
- Automated unit tests for API and UI logic


## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Database:** Firebase Firestore
- **Testing:** Jest, React Testing Library


## Getting Started

### Prerequisites

- Node.js \& npm installed
- Firebase project (create one at https://console.firebase.google.com)


### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/taiwo2/tasktest.git
cd firebase-tasks-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Firebase Setup:**
    - Copy your Firebase config into `src/api/firebase.js`:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // ... other keys
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```


## Running the App

```bash
npm run dev
```

- The app will run on [http://localhost:5137](http://localhost:5137).


## Testing

To run tests:

```bash
npm run test
```


## Project Structure

```
src/
  api/
    firebase.js        # Firebase config
    tasks.js           # Firestore task API endpoints
  component/
    TaskTable.jsx      # Table component for displaying/editing tasks
  App.jsx              # Main app component
  App.css              # Styles
__tests__/
  App.test.js          # App component and logic tests
  TaskTable.test.js    # Table component tests
```

## Authors

👤 Taiwo Adetona

- Github: [@taiwo2](https://github.com/taiwo2)

- LinkedIn: [Taiwo Adetona](https://www.linkedin.com/in/taiwo-adetona/)

- Twitter: [@TaiwoAdetona4](https://twitter.com/TaiwoAdetona4/)


## API Reference

The [API documentation in this repo](/apiDoc.md).

## Contributing

Pull requests are welcome! Open issues or submit feature requests.

## License

[MIT](LICENSE)

***

Feel free to ask for a more tailored README or additional sections!


