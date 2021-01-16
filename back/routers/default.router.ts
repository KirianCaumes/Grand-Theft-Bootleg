import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import { defaultController } from './_initialization.ts'

const defaultRouter = new Router()

defaultRouter
    .get("/api", defaultController.base.bind(defaultController))
    .get("/", defaultController.base.bind(defaultController))

export default defaultRouter