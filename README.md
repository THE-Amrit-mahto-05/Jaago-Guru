# 🤖 InterviewMate
**Master your next career move with AI.** *Practice real-world interviews with an intelligent AI recruiter that listens, evaluates, and helps you grow.*

---

## 🌟 The Problem
Standard interview prep involves reading static lists of questions, which doesn't simulate the pressure or the flow of a real conversation. Job seekers often lack real-time feedback on their technical depth, voice clarity, and behavioral responses.

**InterviewMate** bridges this gap. By combining generative AI with voice technology, it provides a safe yet realistic environment to practice technical and behavioral interviews, offering deep analytics to turn your weaknesses into strengths.

---

## 🚀 What It Can Do

### 🎙️ AI-Powered Voice & Text Practice
Choose your interview mode. Practice with a realistic **AI voice** that conducts the session or use text-based inputs. The system mimics a real interviewer, asking follow-up questions based on your previous answers.

### 🧠 Personalized Question Generation
No more generic lists. By using **Google Gemini AI**, the platform generates specific questions based on your Job Position (e.g., React Developer, Backend Engineer) and the provided Job Description.

### 📊 Performance Analytics & Feedback
After every session, the AI evaluates your responses. It provides a detailed breakdown of:
* **Answer Accuracy:** How well you hit the technical requirements.
* **Improvement Tips:** Specific advice on how to structure your answers better.
* **Interview History:** Track your progress over time with a personal dashboard of past sessions.

### 🔐 Secure & Personalized Workspace
Your data and history are protected. Every user has a private dashboard to manage their specific interview history, performance metrics, and personalized MCQ results.

---

## 🛠️ The Tech Stack



| Layer | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **React.js & Tailwind CSS** | For a fast, responsive, and modern user interface. |
| **Backend** | **Node.js & Express** | Scalable server logic to handle AI processing and user data. |
| **Database** | **PostgreSQL** | Relational data for complex interview history and analytics. |
| **ORM** | **Prisma** | Type-safe database interactions and easy schema management. |
| **AI Engine** | **Gemini API** | To generate context-aware questions and evaluate answers. |
| **Voice Tech**| **DeepGram API** | For realistic voice-based mock interview sessions. |
| **Authentication** | **JWT (JSON Web Tokens)** | Secures user sessions and protects private interview data. |
---

## 🧠 How It Works (Simple Steps)

1.  **🔐 Authenticate:** Log in to your secure dashboard to access your personal history.
2.  **📋 Set the Stage:** Enter the Job Position and Description you are targeting.
3.  **🎯 Select Mode:** Choose between Technical, Behavioral, or MCQ-based rounds.
4.  **💬 The Interview:** Engage with the AI via voice or text as it asks tailored questions.
5.  **📈 Get Scored:** Receive an instant, AI-driven evaluation with your "Ideal Answer" comparison.
6.  **🔄 Improve:** Review your analytics and history to sharpen your skills for the real thing.

---

## 🗂️ Project Architecture

The project is structured to separate the complex AI logic from the user interface:



```text
InterviewMate/
 ├── frontend/
 │    ├── components/ 
 │    ├── pages/      
 │    └── App.jsx     
 ├── backend/
 │    ├── routes/      
 │    ├── controllers/ 
 │    ├── middleware/  
 │    ├── prisma/      
 │    └── index.js     
 └── package.json
