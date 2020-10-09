import { Router } from 'https://deno.land/x/oak/mod.ts'
import { defaultController } from './_dep.ts'

const defaultRouter = new Router()

defaultRouter
    .get("/api", defaultController.base.bind(defaultController))
    .get("/(.*)", defaultController.base.bind(defaultController))

export default defaultRouter