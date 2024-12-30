import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { AppDataSource } from "./data-source"
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import { authenticateToken } from './middleware/auth'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authenticateToken, userRoutes)

const PORT = process.env.PORT || 3001

AppDataSource.initialize().then(() => {
    console.log("Database connected")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(error => console.log(error)) 