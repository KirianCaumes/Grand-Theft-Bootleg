import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts"
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { config } from "https://deno.land/x/dotenv@v0.5.0/mod.ts"
import UnauthorizedException from "../types/exceptions/UnauthorizedException.ts"

export default async function validateToken(ctx: Context, next: Function) {
    if (!ctx.request.headers.get('Authorization'))
        throw new UnauthorizedException('Token not found')

    const res = await validateJwt({
        jwt: ctx.request.headers.get('Authorization')?.replace(/Bearer /, '')!,
        key: config()?.JWT_KEY,
        algorithm: 'HS256'
    })

    if (!res.isValid)
        throw new UnauthorizedException(res.error?.message || 'Invalid token')

    await next()
}