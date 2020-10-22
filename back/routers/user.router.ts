import { Router } from 'https://deno.land/x/oak/mod.ts'
import { userController } from './_initialization.ts'

const userRouter = new Router({ prefix: '/api/user' })

userRouter
    .post('/login', userController.login.bind(userController))
    .post('/register', userController.register.bind(userController))

export default userRouter
