import type {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import { usersRepository } from '../repository/users-repository.js'

async function login(req: Request, res: Response) {
    const {email, password} = req.body ?? {}

    const user = await usersRepository.findUserByEmail(email)

    if (!user) {
        return res.status(401).json({message: 'Invalid Credentials email'})
    }

    if (password !== user.password) {
         return res.status(401).json({message: 'Invalid Credentials password'})
    }

    const id = user.id
    const token = jwt.sign({id}, process.env.JWT_SECRET!, {
        expiresIn: parseInt(process.env.JWT_EXPIRES!)
    })
    return res.json({token})
}

async function logout(req: Request, res: Response) {
    const token = req.headers['authorization']?.replace('Bearer ', '')
    return res.status(401).json({message: "sem token"})
}

export const authController = {login, logout}