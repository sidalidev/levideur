import express from "express"
import morgan from "morgan"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const SECRET = "secret"

const PORT = 1234

// Initialisation de Express 4
const app = express()

// Activation de CORS pour les CORS...
app.use(cors())
// Activation de Morgan pour les logs
app.use(morgan("tiny"))
// Activation du raw (json)
app.use(express.json())
// Activation de x-wwww-form-urlencoded

app.use(express.urlencoded({ extended: true }))

// Initialisation du client Prisma
const prisma = new PrismaClient()

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany()
  res.send(users)
})

app.post("/signup", async (req, res) => {
  // Plus y a de sel plus le mdp sera dur à brute force
  const salt = await bcrypt.genSalt(10)
  // Je gen un mdp crypté
  const crypted_password = await bcrypt.hash(req.body.password, salt)

  const { id, email } = await prisma.user.create({
    data: {
      email: req.body.email,
      password: crypted_password,
    },
  })
  const access_token = jwt.sign({ id }, SECRET, { expiresIn: "3 hours" })
  res.send({ id, email, token: access_token })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
