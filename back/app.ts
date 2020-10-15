import { Application } from "https://deno.land/x/oak/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import bootlegRouter from "./routers/bootleg.router.ts"
import defaultRouter from "./routers/default.router.ts"

/** About API */
const HOST = config()?.HOST || "0.0.0.0"
const PORT = config()?.PORT || 5000

const app = new Application()

//Handle un-caught errors
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        ctx.response.status = 500
        ctx.response.body = {
            message: error.message,
            result: error.stack
        }
    }
})

app.use(bootlegRouter.routes())
app.use(defaultRouter.routes())

app.use(bootlegRouter.allowedMethods())
app.use(defaultRouter.allowedMethods())

app.addEventListener("listen", ({ hostname, port, secure }) =>
    console.log(`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`)
)

await app.listen(`${HOST}:${PORT}`)