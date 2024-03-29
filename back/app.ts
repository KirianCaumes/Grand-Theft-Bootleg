import { Application, send } from "https://deno.land/x/oak@v6.3.2/mod.ts"
import bootlegRouter from "./routers/bootleg.router.ts"
import defaultRouter from "./routers/default.router.ts"
import errorsLoader from "./loaders/errors.loader.ts"
import startupLoader from "./loaders/startup.loader.ts"
import bandRouter from "./routers/band.router.ts"
import songRouter from "./routers/song.router.ts"
import userRouter from "./routers/user.router.ts"
import { env } from "./helpers/config.ts"
import { exists } from "https://deno.land/std@0.69.0/fs/exists.ts"
import NotFoundException from "./types/exceptions/NotFoundException.ts"

const HOST = env?.HOST || "0.0.0.0"
const PORT = env?.PORT || 5000

const app = new Application()

app.use(errorsLoader)

app.use(bootlegRouter.routes())
app.use(bandRouter.routes())
app.use(songRouter.routes())
app.use(userRouter.routes())
app.use(defaultRouter.routes())

app.use(bootlegRouter.allowedMethods())
app.use(bandRouter.allowedMethods())
app.use(songRouter.allowedMethods())
app.use(userRouter.allowedMethods())
app.use(defaultRouter.allowedMethods())

app.use(async context => {
    if (await exists(`${Deno.cwd()}/public/${context.request.url.pathname}`))
        await send(context, context.request.url.pathname, { root: `${Deno.cwd()}/public` })
    else
        throw new NotFoundException()
})



if (env?.DENO_ENV !== 'test') {
    app.addEventListener("listen", startupLoader)
    await app.listen(`${HOST}:${PORT}`)
}

export default app

