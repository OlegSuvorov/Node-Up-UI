import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const userRepository = AppDataSource.getRepository(User)

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await userRepository.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' },
        )

        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token
        })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" })
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body

        // Check for existing user
        const existingUser = await userRepository.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isActive: true,
        })
        
        await userRepository.save(user)

        res.status(201).json({ 
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        })
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error" })
    }
} 
