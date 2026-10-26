import { Router } from 'express'
import { usersController } from '../controller/users-controller.js'
import { verifyJwt } from '../middleware/auth-middleware.js'

const usersRouter = Router()

usersRouter.post('/', usersController.createUser)
usersRouter.post('/many', usersController.createManyUsers)
usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:id', verifyJwt, usersController.getUserById)
usersRouter.put('/:id', usersController.updateUser)
usersRouter.delete('/:id', usersController.deleteUser)

export { usersRouter }

