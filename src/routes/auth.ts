import express from 'express'
import { signin } from '../controllers/auth'
import { register } from 'module'


export const authRouter = express.Router()

authRouter.post('/signin', signin)

authRouter.post('/register', register)

