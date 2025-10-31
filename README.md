# 🤖 AI Interview Practice Platform

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js-black?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)
![OpenAI](https://img.shields.io/badge/AI-OpenAI_API-412991?logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> An **AI-powered web platform** that helps users practice interviews, receive intelligent feedback, and track progress — built with **React, Node.js, Express, MySQL, and OpenAI API**.

---

## 🧭 1. Project Overview

**Goal:**  
Build a web platform where users can:
- 🗣️ Practice interviews with an AI interviewer (text-based)
- 🧠 Receive personalized feedback (clarity, confidence, completeness)
- 📈 Track their performance over multiple sessions

---

## 🧩 2. Features (Phase-wise)

### 🟢 Phase 1 – Core MVP
Focus on essential functionality.

✅ Features:
1. User authentication (Login / Signup)  
2. Dashboard after login  
3. Start AI interview (chat interface)  
4. AI asks 5–10 questions (based on chosen role)  
5. User types answers  
6. AI gives feedback on each answer  
7. Store questions, answers, and scores in MySQL  
8. View past interview history  

---

### 🟡 Phase 2 – Smart Features *(Optional)*
Enhance the user experience.

⚙ Add:
1. Role-based interviews (e.g., Frontend Developer, Data Analyst)  
2. Difficulty levels (Easy / Medium / Hard)  
3. Resume upload → AI generates questions from resume  
4. Analytics dashboard (average score, improvement chart)  
5. AI summary feedback for full interview  

---

### 🔵 Phase 3 – Advanced / Bonus Features *(Optional)*
For later expansion.

💬 Add:
1. Voice-based interviews (Speech-to-Text + Text-to-Speech)  
2. Timed responses (simulate real interviews)  
3. HR-style evaluation (soft skills, tone, confidence)  
4. Admin panel to manage questions, users, and statistics  

---

## 🧱 3. Tech Stack

| Layer | Tool | Description |
|-------|------|-------------|
| **Frontend** | React.js / Next.js | Build the user interface |
| **Styling** | Tailwind CSS / Material UI | Modern, responsive design |
| **Backend** | Node.js + Express.js | REST API and server logic |
| **Database** | MySQL | Store users, sessions, and interview data |
| **AI** | OpenAI API (GPT-4 / 3.5-turbo) | Generate questions and feedback |
| **Authentication** | JWT or Firebase Auth | Secure login/signup |
| **Hosting** | Vercel (Frontend), Render (Backend) | Free deployment |
| **Version Control** | Git + GitHub | Manage and track code |
| **Optional API** | Whisper API | Speech-to-Text for voice interviews |

---

## 🗄️ 4. Database Design

### 🧍‍♂️ Table: `Users`
| Field | Type | Description |
|--------|------|-------------|
| user_id | INT (PK) | Unique user ID |
| name | VARCHAR | User name |
| email | VARCHAR | Unique email |
| password | VARCHAR | Hashed password |
| created_at | DATETIME | Registration time |

### 💬 Table: `Interviews`
| Field | Type | Description |
|--------|------|-------------|
| interview_id | INT (PK) | Unique interview ID |
| user_id | INT (FK) | Linked to Users |
| role | VARCHAR | Role (e.g., "Frontend Developer") |
| difficulty | VARCHAR | Easy / Medium / Hard |
| date | DATETIME | Interview timestamp |
| overall_score | FLOAT | Average feedback score |

### 📝 Table: `Questions`
| Field | Type | Description |
|--------|------|-------------|
| question_id | INT (PK) | Unique question ID |
| interview_id | INT (FK) | Linked to Interviews |
| question_text | TEXT | AI-generated question |
| user_answer | TEXT | User’s response |
| ai_feedback | TEXT | AI feedback text |
| score | FLOAT | Numeric rating |

---

## 🧠 5. AI Logic

1. **Generate Questions**  
   - Prompt: “Generate 5 interview questions for a React.js developer (medium difficulty).”

2. **User Answers**  
   - Store responses temporarily in frontend state.

3. **AI Feedback**  
   - Prompt: “Evaluate this answer for clarity, correctness, and confidence. Give a score out of 10 and short feedback.”

4. **Store Everything**  
   - Save all questions, answers, and feedback to database.

---

## ⚙️ 6. API Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/interview/start` | POST | Start new interview (AI-generated questions) |
| `/api/interview/answer` | POST | Send answer and receive AI feedback |
| `/api/interview/history` | GET | Fetch past interviews for user |
| `/api/interview/details/:id` | GET | Fetch detailed interview data |

---

## 🖼️ 7. Frontend Structure

**Main Pages / Components:**
- `/` → Landing Page  
- `/login` → Login  
- `/signup` → Signup  
- `/dashboard` → User dashboard  
- `/interview` → Chat-based interview interface  
- `/results/:id` → Interview results and feedback page  

---

## 🚀 8. Development Roadmap

### 🕐 Week 1 – Setup & Authentication
- Setup React, Node, and MySQL  
- Implement JWT authentication  
- Setup frontend routing (React Router)

### 🕑 Week 2 – Core Interview System
- Integrate OpenAI API  
- Generate and display AI questions  
- Build chat-like interface for Q&A  
- Store user answers and feedback in database  

### 🕒 Week 3 – Dashboard + History
- Create user interview history page  
- Display past performance and analytics  
- Improve UI with Tailwind or Material UI  

### 🕓 Week 4 – Polishing & Deployment
- Add loading states and error handling  
- Deploy on Vercel (frontend) and Render (backend)  
- Prepare presentation and final README  

*(Optional Week 5 – Add resume or voice-based features)*

---

## 🪄 License
This project is open-source and free to use for educational purposes.

