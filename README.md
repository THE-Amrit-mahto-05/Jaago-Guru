# Jaago-Guru: AI Interview Platform

> An AI-powered web platform that helps users practice interviews, receive intelligent feedback, and track progress — built with React, Node.js, Express, Prisma ORM ,Postgresql, and Gemini API.

---

## 1. Project Overview

**Goal:**  
Build a web platform where users can:
- Practice interviews with an AI interviewer (speech and text)
- Receive personalized feedback (clarity, confidence, completeness)
- Track their performance and progress

---

## 2. Features (Phase-wise)

### Phase 1 – Core MVP

**Features:**
1. User authentication (Login / Signup)  
2. Dashboard after login  
3. Start AI interview (chat interface)  
4. AI asks questions based on chosen role  
5. User can answer by typing or speaking  
6. AI gives feedback on each answer  
7. Store questions, answers, and scores in MySQL  
8. View past interview history  

---

### Phase 2 – Smart Features (Optional)

**Add:**
1. Role-based interviews (e.g., Frontend Developer, Data Analyst)  
2. Experience levels (Junior / Mid / Intern / senior)  
4. Analytics dashboard (average score, improvement chart)  
5. AI summary feedback for full interview  

---

### Phase 3 – Advanced / Bonus Features

**Add:**
1. Voice-based interviews (Speech-to-Text + Text-to-Speech)  
2. Timed responses (simulate real interviews)  
3. HR-style evaluation (soft skills, tone, confidence)  

---

## 3. Tech Stack

| Layer | Tool | Description |
|-------|------|-------------|
| **Frontend** | React.js | Build the user interface |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Backend** | Node.js + Express.js | REST API and server logic |
| **Database** | postgresql | Store users and interview data |
| **AI** | Gemini API | Generate questions and feedback | and Deepgram API | for AI interview
| **Authentication** | JWT or Supabase Auth | Secure login/signup |
| **Hosting** | Vercel (Frontend), Render (Backend) | 

---

## 4. AI Logic

1. **Generate Questions**  
   Prompt: “Generate 5 interview questions for a React.js developer (medium difficulty).”

2. **User Answers**  
   Store responses temporarily in frontend state.

3. **AI Feedback**  
   Prompt: “Evaluate this answer for clarity, correctness, and confidence. Give score out of 10 and short feedback.”

4. **Store Everything**  
   Save all questions, answers, and feedback to the database.

---

## 5. API Endpoints

| Endpoint                      | Method | Description                                   | Notes                                             |
|------------------------------|--------|-----------------------------------------------|--------------------------------------------------|
| /api/auth/signup             | POST   | Register a new user                          | Validates email/password, stores in DB           |
| /api/auth/login              | POST   | Login user                                   | Returns JWT token for authentication             |
| /api/interview/start         | POST   | Start a new AI-generated interview session   | Generates questions using AI (gemini.js)         |
| /api/interview/answer        | POST   | Send user's answer and receive AI feedback   | Stores answer and returns evaluation             |
| /api/interview/history       | GET    | Fetch list of past interviews for a user     | Requires authentication                          |
| /api/interview/details/:id   | GET    | Fetch detailed data of a specific interview  | Includes questions, answers, AI feedback         |
| /api/mcq/list                | GET    | Fetch MCQs for a subject/topic               | Returns list of questions                        |
| /api/mcq/submit              | POST   | Submit MCQ answers                           | Calculates score and stores results              |
| /api/ai/analyze              | POST   | Send text or input for AI analysis           | Returns AI-generated insights or suggestions     |


## 6. Frontend Structure

| Route                      | Component           | Description                                                 |
|----------------------------|---------------------|-------------------------------------------------------------|
| /                          | Landing.jsx         | Landing / home page                                         |
| /login                     | Login.jsx           | Login form for existing users                               |
| /signup                    | SignUp.jsx          | Signup form for new users                                   |
| /dashboard                 | Dashboard.jsx       | User dashboard; overview of past interviews, quizzes, etc.  |
| /interview                 | Subjects.jsx        | List of subjects/topics for AI interviews or MCQs           |
| /interview/quiz            | QuizMode.jsx        | Page to attempt MCQ quizzes                                 |
| /interview/start           | Interview.jsx       | Start a chat-based AI interview                             |
| /interview/:id             | InterviewSession.jsx| Active interview session                                    |
| /interview/:id/summary     | InterviewSummary.jsx| Detailed results and AI feedback for a completed interview  |
| /subjects                  | Subjects.jsx        | View all subjects (alternative route)                       |
| /topics                    | Topics.jsx          | View topics under a subject                                 |

---

## 8. Development Roadmap

### Week 1 – Setup & Authentication
- Setup React, Node, and Postgrel 
- Implement JWT authentication  
- Setup frontend routing (React Router)

### Week 2 – Core Interview System
- Integrate Gemini API  
- Generate and display AI questions  
- Build chat-like interface for Q&A  
- Store user answers and feedback in database  

### Week 3 – Dashboard + History
- Create user interview history page  
- Display past performance and analytics  
- Improve UI with Tailwind or Material UI  

### Week 4 – Polishing & Deployment
- Add loading states and error handling  
- Deploy on Vercel (frontend) and Render (backend)  
- Prepare presentation and final README  

*(Optional Week 5 – Add resume or voice-based features)*

---


---

## 7. Setup Instructions

### Step 1: Clone the Repository

```
git clone https://github.com/your-username/jaago-guru.git
cd jaago-guru
```



### Step 2: Frontend Setup
```
cd frontend
npm install
npm run dev
```


### Step 3: Backend Setup
```
cd backend
npm install
npm run dev
```

### Step 4: .env Backend

.env file:
```
PORT=5000
DATABASE_URL=postgresql****
DIRECT_URL=postgril....
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_openai_api_key
```
### Step 5: .env Frontend
```
VITE_DEEPGRAM_API_KEY=api_key_for_ai_voice_interview
```
### Step 5: Connect Frontend and Backend
```
VITE_API_URL=https://jaago-guru.onrender.com
```

## 8. Contributors

- **Amrit Kumar Mahto**  
- **Anuj Chhajad**  
- **Ayush Kumar**  
- **Nakul Sharma**







