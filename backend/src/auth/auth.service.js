const prisma = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async ({name, email, password}) => {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await prisma.user.findUnique({
    where: {email}
  })

  if (existingUser){
    throw new Error("User already exists")
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {name, email, password: hashed}
  })

  const token = jwt.sign({id: user.id, email: user.email, name: user.name}, process.env.JWT_SECRET, {expiresIn: "1d"})

  const { password: _, ...safeUser } = user
  return { user: safeUser, token }
}

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email format");
  }

  const user = await prisma.user.findUnique({
    where: {email}
  })

  if (!user){
    throw new Error("Invalid email or password")
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid){
    throw new Error("Invalid email or password")
  }

  const token = jwt.sign({id: user.id, email: user.email, name: user.name}, process.env.JWT_SECRET, {expiresIn: "1d"})

  const { password: _, ...safeUser } = user
  return { user: safeUser, token }
}

module.exports = {registerUser, loginUser}