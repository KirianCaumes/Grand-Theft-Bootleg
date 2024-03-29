import { Router } from 'https://deno.land/x/oak@v6.3.2/mod.ts'
import { bootlegController } from './_initialization.ts'
import validateToken from "../helpers/validateToken.ts"

const bootlegRouter = new Router({ prefix: '/api/bootleg' })

bootlegRouter
    .get('/', bootlegController.getAllBootlegs.bind(bootlegController))
    .get('/:id', bootlegController.getBootleg.bind(bootlegController))
    .post('/:id/image', validateToken, bootlegController.uploadImage.bind(bootlegController))
    .post('/:id/clicked', validateToken, bootlegController.clicked.bind(bootlegController))
    .post('/:id/report', validateToken, bootlegController.addReport.bind(bootlegController))
    .post('/', validateToken, bootlegController.addBootleg.bind(bootlegController))
    .put('/:id', validateToken, bootlegController.updateBootleg.bind(bootlegController))
    .delete('/:id/image', validateToken, bootlegController.removeImage.bind(bootlegController))
    .delete('/:id/report', validateToken, bootlegController.clearReport.bind(bootlegController))
    .delete('/:id', validateToken, bootlegController.deleteBootleg.bind(bootlegController))
    .all('/(.*)', bootlegController.base.bind(bootlegController))

export default bootlegRouter
