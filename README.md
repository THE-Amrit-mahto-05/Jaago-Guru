# Jaago-Guru: AI Interview Platform

> An AI-powered web platform that helps users practice interviews, receive intelligent feedback, and track progress — built with React, Node.js, Express, MySQL, and OpenAI API.

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
8. View past interview history (progress report)  

---

### Phase 2 – Smart Features (Optional)

**Add:**
1. Role-based interviews (e.g., Frontend Developer, Data Analyst)  
2. Difficulty levels (Easy / Medium / Hard)  
3. Resume upload → AI generates questions from resume  
4. Analytics dashboard (average score, improvement chart)  
5. AI summary feedback for full interview  

---

### Phase 3 – Advanced / Bonus Features

**Add:**
1. Voice-based interviews (Speech-to-Text + Text-to-Speech)  
2. Timed responses (simulate real interviews)  
3. HR-style evaluation (soft skills, tone, confidence)  
4. Admin panel to manage questions, users, and statistics  

---

## 3. Tech Stack

| Layer | Tool | Description |
|-------|------|-------------|
| **Frontend** | React.js | Build the user interface |
| **Styling** | Tailwind CSS / Material UI | Modern, responsive design |
| **Backend** | Node.js + Express.js | REST API and server logic |
| **Database** | MySQL | Store users, sessions, and interview data |
| **AI** | OpenAI API (GPT-4 / 3.5-turbo) | Generate questions and feedback |
| **Authentication** | JWT or Firebase Auth | Secure login/signup |
| **Hosting** | Vercel (Frontend), Render (Backend) | Free deployment |
| **Optional API** | Whisper API | Speech-to-Text for voice interviews |

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

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/interview/start` | POST | Start new interview (AI-generated questions) |
| `/api/interview/answer` | POST | Send answer and receive AI feedback |
| `/api/interview/history` | GET | Fetch past interviews for user |
| `/api/interview/details/:id` | GET | Fetch detailed interview data |

---

## 6. Frontend Structure

**Main Pages / Components:**
- `/` → Landing Page  
- `/login` → Login  
- `/signup` → Signup  
- `/dashboard` → User dashboard  
- `/interview` → Chat-based interview interface  
- `/results/:id` → Interview results and feedback page  

---

## 8. Development Roadmap

### Week 1 – Setup & Authentication
- Setup React, Node, and MySQL  
- Implement JWT authentication  
- Setup frontend routing (React Router)

### Week 2 – Core Interview System
- Integrate OpenAI API  
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
npm install nodemon 
```


To start the backend server:
```
npx nodemon server.js
```

### Step 4: Configure MySQL Database

Create a new MySQL database (e.g., jaago_guru_db).

Add your database credentials in the .env file inside the backend folder.

Example .env file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=jaago_guru_db
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### Step 5: Connect Frontend and Backend
```
VITE_API_URL=http://localhost:5000/api
```

## 12. Contributors

- **Amrit Kumar Mahto**  
- **Anuj Chhajad**  
- **Ayush Kumar**  
- **Nakul Sharma**







