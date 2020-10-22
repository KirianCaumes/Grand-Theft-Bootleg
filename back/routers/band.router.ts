import { Router } from 'https://deno.land/x/oak/mod.ts'
import { bandController } from './_initialization.ts'
import validateToken from "../helpers/validateToken.ts"

const bandRouter = new Router({ prefix: '/api/band' })

bandRouter
    .get('/', validateToken, bandController.getBands.bind(bandController))

export default bandRouter
