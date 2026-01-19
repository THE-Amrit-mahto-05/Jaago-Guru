require('dotenv').config()
console.log("DB HOST:", process.env.DATABASE_URL);
const express = require('express')
const cors = require("cors")
const authRoutes = require("./auth/auth.route")
const interviewRoutes = require("./interview/interview.route")
const mcqRoutes = require("./mcq/mcq.router.js");

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use("/api/interview", interviewRoutes)
app.use("/api/mcq", mcqRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({success: false, message: err.message || 'Something went wrong!', data: null})
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
