import express from 'express'
import { signin, register } from '../controllers/auth'


export const authRouter = express.Router()

authRouter.post('/signin', signin)

authRouter.post('/register', register)

