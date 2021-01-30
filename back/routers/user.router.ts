import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import validateToken from "../helpers/validateToken.ts"
import { userController } from './_initialization.ts'

const userRouter = new Router({ prefix: '/api/user' })

userRouter
    .post('/login', userController.login.bind(userController))
    .post('/', userController.register.bind(userController))
    .get('/me', validateToken, userController.getMe.bind(userController))
    .patch('/me/mail/:type(password|delete)', validateToken, userController.sendMail.bind(userController))
    .patch('/action/:token/reset-pwd', userController.resetPwd.bind(userController))
    .patch('/action/:token/delete-account', userController.deleteAccount.bind(userController))
    .all('/(.*)', userController.base.bind(userController))

export default userRouter
