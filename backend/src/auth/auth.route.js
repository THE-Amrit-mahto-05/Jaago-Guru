const express = require("express")
const { register, login } = require("./auth.controller")
const { verifyToken } = require("./auth.middleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", verifyToken, (req, res) => {
<<<<<<< HEAD
  res.json({ message: "Profile accessed", user: req.user })
=======
  res.json({ msg: "Profile accessed", user: req.user })
>>>>>>> 8a71f7a3de8e7c920581c9eb4f8f257a1d208aa4
});

module.exports = router