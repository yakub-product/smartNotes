# SmartNotes - AI-Powered Study Companion

SmartNotes is an intelligent note-taking application designed for students. It leverages Google Gemini AI to help organize, summarize, and enhance study materials.

## Features

- **User Authentication**: Secure Signup/Login using Firebase Auth.
- **Note Management**: Create, Read, Update, and Delete notes.
- **AI Integrations**:
  - **Summarize**: Get concise summaries of long notes.
  - **Explain**: Highlight text to get simple explanations.
  - **Quiz Generation**: Automatically generate quizzes from your notes.
  - **Enhance**: Improve grammar and expand on key points.
- **Cloud Storage**: All data is synced in real-time using Firebase Firestore.
- **Modern UI**: Response, glassmorphic design with Dark Mode.

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (ES6+ Modules)
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore, Firebase Authentication
- **AI**: Google Gemini API (@google/generative-ai)

## Prerequisites

- Node.js (v14 or higher)
- npm

## Setup Instructions

1. **Clone the repository** (or navigate to the folder).
2. **Install Backend Dependencies**:
   ```bash
   cd smartnotes/backend
   npm install
   ```
3. **Environment Configuration**:
   - The file `smartnotes/backend/.env` is already configured with the necessary API Keys for this project.
   - `GEMINI_API_KEY`: Google AI Studio Key.

## Running the Application

1. Open a terminal in `smartnotes/backend`.
2. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```
3. The application will be available at: http://localhost:3000

## API Structure

- `POST /api/ai/summarize`: { content: string }
- `POST /api/ai/explain`: { text: string }
- `POST /api/ai/quiz`: { content: string }
- `POST /api/ai/enhance`: { content: string }

## Project Structure

```
smartnotes/
├── frontend/          # Client-side code
│   ├── index.html     # Auth Page
│   ├── dashboard.html # Main App
│   └── js/            # Logic (Auth, Notes, AI)
├── backend/           # Server-side code
│   ├── server.js      # Express App
│   ├── routes/        # API Endpoints
│   └── config/        # API Configurations
└── README.md
```

## Security

- API Keys for AI are stored exclusively in the backend (`.env`).
- Firebase Client Config is public but protected by Firestore security rules (to be configured in Firebase Console).
