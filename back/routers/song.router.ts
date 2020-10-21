import { Router } from 'https://deno.land/x/oak/mod.ts'
import { songController } from './_initialization.ts'

const songRouter = new Router({ prefix: '/api/song' })

songRouter
    .get('/', songController.getSongs.bind(songController))

export default songRouter
