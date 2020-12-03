import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import { userController } from './_initialization.ts'

const userRouter = new Router({ prefix: '/api/user' })

userRouter
    .post('/login', userController.login.bind(userController))
    .post('/', userController.register.bind(userController))
    .get('/me', userController.getMe.bind(userController))

export default userRouter
