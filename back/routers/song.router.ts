import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import { songController } from './_initialization.ts'
import validateToken from "../helpers/validateToken.ts"

const songRouter = new Router({ prefix: '/api/song' })

songRouter
    .get('/', validateToken, songController.getSongs.bind(songController))

export default songRouter
