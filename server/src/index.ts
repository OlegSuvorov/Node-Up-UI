import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { AppDataSource } from "./data-source"
import authRoutes from './routes/auth'
import userRoutes from './routes/users'

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 3001

AppDataSource.initialize().then(() => {
    console.log("Database connected")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(error => console.log(error)) 