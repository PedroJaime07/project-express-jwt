import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({message: 'não autorizado'})
    }

    token = token.replace('Bearer ', '')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        if (!decoded) res.status(401).json({message: 'não autorizado'})
        return next()
    } catch (error) {
        return res.status(401).json({message: 'não autorizado'})
    }
}

export {verifyJwt}