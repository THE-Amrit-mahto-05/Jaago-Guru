require('dotenv').config()
const express = require('express')
const cors = require("cors")
const authRoutes = require("./auth/auth.route")
const interviewRoutes = require("./interview/interview.route")
const mcqRoutes = require("./mcq/mcq.route.js");
const PORT = process.env.PORT || 3000;

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jaago-guru-ke77.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use("/api/interview", interviewRoutes)
app.use("/api/mcq", mcqRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({success: false, message: err.message || 'Something went wrong!', data: null})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
