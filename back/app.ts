import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts"
import bootlegRouter from "./routers/bootleg.router.ts"
import defaultRouter from "./routers/default.router.ts"
import errorsLoader from "./loaders/errors.loader.ts"
import startupLoader from "./loaders/startup.loader.ts"
import bandRouter from "./routers/band.router.ts"
import songRouter from "./routers/song.router.ts"
import userRouter from "./routers/user.router.ts"
import { env } from "./helpers/config.ts"

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

if (env?.DENO_ENV !== 'test') {
    app.addEventListener("listen", startupLoader)
    await app.listen(`${HOST}:${PORT}`)
}

export default app

