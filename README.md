# **Jaggo Guru** - Focus Activation Platform

### **Description**

**Jaggo Guru** interactive platform designed to help students, professionals, and anyone in need of a mental boost to activate their focus within just **5 minutes**. Whether you're in class, at work, or studying at home, **Jaggo Guru** will help you through an engaging, fun, and efficient routine that clears distractions, reactivates your focus, and prepares you for a productive session.

Our goal is to create a **personalized, engaging**, and highly interactive experience that uses a combination of **cognitive challenges**, **sensory activation**, and **motivational techniques** to help users **reset their brain**, **boost focus**, and **increase productivity**.

---

### **Project Aim**

**Jaggo Guru** is designed to empower users by enabling them to become highly focused within just **5 minutes**. The platform utilizes a combination of **mental exercises**, **focus challenges**, and **positive reinforcement** to clear distractions and provide an instant mental reset.

Our mission is to provide a tool that supports students and professionals in maintaining their productivity by preparing them for intense focus in a matter of minutes. By the end of the 5-minute cycle, users will feel **energized**, **mentally sharp**, and **ready to tackle their tasks** with laser-like focus.

---

### **How It Works: The 5-Minute Focus Activation Routine**

The 5-minute focus activation process is broken down into **5 distinct steps** to guide users from a distracted or unfocused state to a highly productive, focused one.

1. **Mood Check & Breathing Exercise (0:00–1:00)**  
   - **Goal**: Calm the mind and prepare for focus.  

2. **Sensory Activation (1:00–2:00)**  
   - **Goal**: Activate sensory engagement and enhance focus.  
  

3. **Activate short memory/pattern(2:00–3:00)**  
   - **Goal**: Jolt the brain into focus and enhance cognitive recall.  
  
4. **Brain reset(3:00–4:00)**  
   - **Goal**: Reset the brain.  
   

5. **Affirmation & Motivation (4:00–5:00)**  
   - **Goal**: Empower the user with a positive affirmation and prepare them to start their task.  
---

### **Tech Stack**
- **Frontend**:  
  - **React Native or React** 
  - **Canvas-based animations**
  - **Audio**

- **Backend**:  
  - **Node.js** with **Express** for building the server-side RESTful API.
  - **MongoDB** or **mySQL** as the database solution (depending on your needs).
  - **JWT Authentication** for secure user login and token management.

- **Database**:  
  - **MongoDB** (NoSQL) or **mySql** (SQL) for storing user data, progress, and focus session history.

---

### **Folder Structure**

Below is the folder structure for the **Jaggo Guru** project. It includes both **frontend** (React Native/React), **backend** (Node.js/Express), and **database** structure.

```plaintext
Jaggo-Guru/
│
├── frontend/               # Frontend Application (React Native or React)
│   ├── assets/             # Static assets (images, fonts, icons)
│   ├── components/         # Reusable UI components
│   ├── config/             # Config files (API URLs, environment variables)
│   ├── hooks/              # Custom React Hooks (for state management, API calls)
│   ├── navigation/         # Navigation files (React Navigation)
│   ├── screens/            # Screens or Views (login, home, dashboard, etc.)
│   ├── services/           # API services, data fetching functions
│   ├── store/              # Redux or context for state management
│   ├── utils/              # Utility functions (validators, formatters)
│   ├── App.js / App.dart   # Main entry point for the app (React Native or React)
│   ├── package.json        # Frontend dependencies and scripts
│   └── .env                # Environment variables for frontend (API keys, etc.)
│
├── backend/                # Backend Application (Node.js, Express)
│   ├── controllers/        # Logic for handling requests (API endpoints)
│   ├── middlewares/        # Custom middleware (auth checks, logging)
│   ├── models/             # Database models (schemas for MongoDB, MySQL, etc.)
│   ├── routes/             # Express routes for API
│   ├── services/           # Business logic (connecting with the database)
│   ├── utils/              # Helper functions (error handling, response formatters)
│   ├── app.js              # Main entry point (server setup and middleware)
│   ├── config/             # Configuration files (database connections, environment settings)
│   ├── package.json        # Backend dependencies and scripts
│   └── .env                # Environment variables for backend (API keys, database URL, etc.)
│
├── database/               # Database-specific files (scripts, migrations, seed data)
│   ├── migrations/         # Database migrations for versioning (if applicable)
│   ├── seeders/            # Seed data (for initial setup)
│   ├── models/             # Database models (if not in backend folder)
│   ├── schema.sql          # Schema for SQL-based DB ( MySQL)
│   └── config.js           # Database connection settings (MongoDB,mySQL, etc.)
│
├── .gitignore              # Files to ignore in version control
├── README.md               # Project documentation (this file)
├── package.json            # Root-level dependencies for monorepo management
└── .env                    # Global environment variables (e.g., API keys for third-party services)
