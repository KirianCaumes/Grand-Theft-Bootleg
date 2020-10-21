import { Router } from 'https://deno.land/x/oak/mod.ts'
import { bandController } from './_initialization.ts'

const bandRouter = new Router({ prefix: '/api/band' })

bandRouter
    .get('/', bandController.getBands.bind(bandController))

export default bandRouter
