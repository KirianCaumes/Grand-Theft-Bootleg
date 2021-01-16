import { Context } from "https://deno.land/x/oak@v6.3.2/context.ts"
import render from "../helpers/render.ts"
import { EApiErrors } from "../types/enumerations/EApiErrors.ts"
import Exception from "../types/exceptions/Exception.ts"
import ForbiddenException from "../types/exceptions/ForbiddenException.ts"
import JwtException from "../types/exceptions/JwtException.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import UnauthorizedException from "../types/exceptions/UnauthorizedException.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"

export default async function errorsLoader(ctx: Context, next: Function) {
    try {
        await next()
    } catch (error) {
        switch (error?.constructor) {
            case NotFoundException:
                ctx.response.status = 404
                ctx.response.body = render({
                    message: error?.message || `Element not found`,
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case Deno.errors.NotFound:
                ctx.response.status = 404
                ctx.response.body = render({
                    message: error?.message || `Element not found`,
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case ForbiddenException:
                ctx.response.status = 403
                ctx.response.body = render({
                    message: error?.message || `You are not allowed to do this action`,
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case UnauthorizedException:
                ctx.response.status = 401
                ctx.response.body = render({
                    message: error?.message || `You are not authenticated`,
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case JwtException:
                ctx.response.status = 401
                ctx.response.body = render({
                    message: error?.message || `You are not authenticated`,
                    error: {
                        code: EApiErrors.JWT_EXPIRED,
                        description: "Your token is invalid or expired"
                    },
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case ValidationException:
                ctx.response.status = 400
                ctx.response.body = render({
                    message: error?.message || `Element not modified or created`,
                    error: {
                        code: EApiErrors.DATA_NOT_WELL_FORMATED,
                        description: "Some fields are invalid",
                        validationResults: (error as ValidationException).validationRows
                    },
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            case Exception:
                ctx.response.status = 400
                ctx.response.body = render({
                    message: error?.message || `An error occured`,
                    result: null,
                    resultKey: (ctx as any)?.matched?.[0]?.path?.split('/')?.[2]
                })
                break
            default:
                ctx.response.status = 500
                ctx.response.body = render({
                    message: error.message,
                    result: error.stack
                })
        }
    }
}