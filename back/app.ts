import { Application } from "https://deno.land/x/oak/mod.ts"
import bootlegRouter from "./routers/bootleg.router.ts"
import defaultRouter from "./routers/default.router.ts"

const HOST = "0.0.0.0"
const PORT = 5000

const app = new Application()

app.addEventListener("error", ev => console.error(ev.error))

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.response.status = 500
        ctx.response.body = { status: 500, message: err.message, result: { stacktrace: err.stack } }
    }
})

app.use(bootlegRouter.routes())
app.use(defaultRouter.routes())

app.use(bootlegRouter.allowedMethods())
app.use(defaultRouter.allowedMethods())

console.log(`Listening on port ${PORT} ...`)
await app.listen(`${HOST}:${PORT}`)