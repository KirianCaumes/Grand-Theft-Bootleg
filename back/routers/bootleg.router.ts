import { Router } from 'https://deno.land/x/oak/mod.ts'
import { bootlegController } from './_dep.ts'

const bootlegRouter = new Router({ prefix: '/api/bootleg' })

bootlegRouter
    .get('/', bootlegController.getBootlegs.bind(bootlegController))
    .get('/:id', bootlegController.getBootleg.bind(bootlegController))
    .post('/', bootlegController.addBootleg.bind(bootlegController))
    .put('/:id', bootlegController.updateBootleg.bind(bootlegController))
    .delete('/:id', bootlegController.deleteBootleg.bind(bootlegController))
    .all('/(.*)', bootlegController.base.bind(bootlegController))

export default bootlegRouter
