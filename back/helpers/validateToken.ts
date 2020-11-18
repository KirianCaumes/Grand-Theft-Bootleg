import { Context } from "https://deno.land/x/oak@v6.3.2/context.ts"
import { verify } from "https://deno.land/x/djwt@v1.9/mod.ts"
import UnauthorizedException from "../types/exceptions/UnauthorizedException.ts"
import { env } from "./config.ts"

export default async function validateToken(ctx: Context, next: Function) {
    if (!ctx.request.headers.get('Authorization'))
        throw new UnauthorizedException('Token not found')

    try {
        await verify(
            ctx.request.headers.get('Authorization')?.replace(/Bearer /, '')!,
            env?.JWT_KEY!,
            'HS512'
        )
    } catch (error) {
        throw new UnauthorizedException(error?.message || 'Invalid token')
    }

    await next()
}