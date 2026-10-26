import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users-routes.js'
import { authRotes } from './routes/auth-rotes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.use('/users', usersRouter)

app.use('/auth', authRotes)


app.use('/check', (req, res) => {
    return res.send('API is running')
})

export {app}
