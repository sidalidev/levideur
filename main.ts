import express from "express"
import morgan from "morgan"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

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

// Requete GET /
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany()
  res.send(users)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
