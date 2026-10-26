import {Router} from 'express'
import { authController } from '../controller/auth-controller.js'

const authRotes = Router()

authRotes.post('/login', authController.login)
authRotes.post('/logout', authController.logout,)

export {authRotes}