import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'

const userRepository = AppDataSource.getRepository(User)

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find({
            select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt']
        })
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOne({
            where: { id: parseInt(req.params.id) },
            select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt']
        })
        
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, isActive } = req.body
        const user = await userRepository.findOne({
            where: { id: parseInt(req.params.id) }
        })
        
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await userRepository.save({
            ...user, 
            firstName,
            lastName,
            email,
            isActive,
        })
        res.json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error updating user" })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOne({
            where: { id: parseInt(req.params.id) }
        })
        
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await userRepository.remove(user)
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" })
    }
} 