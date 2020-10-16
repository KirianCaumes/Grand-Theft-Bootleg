import { Application } from "https://deno.land/x/oak/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import bootlegRouter from "./routers/bootleg.router.ts"
import defaultRouter from "./routers/default.router.ts"
import errorsLoader from "./loaders/errors.loader.ts"
import startupLoader from "./loaders/startup.loader.ts"

const HOST = config()?.HOST || "0.0.0.0"
const PORT = config()?.PORT || 5000

const app = new Application()

app.use(errorsLoader)

app.use(bootlegRouter.routes())
app.use(defaultRouter.routes())

app.use(bootlegRouter.allowedMethods())
app.use(defaultRouter.allowedMethods())

app.addEventListener("listen", startupLoader)

await app.listen(`${HOST}:${PORT}`)