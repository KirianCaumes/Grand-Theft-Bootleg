import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"

/**
 * Base Controller
 */
export default abstract class BaseController {
    constructor() { }

    /**
     * Render data
     * @protected
     * @param obj
     * @param obj.status
     * @param obj.message
     * @param obj.result
     * @param obj.resultType
     * @param obj.stacktrace
     */
    _render(
        { status = 200, result = {}, resultType, message = undefined, stacktrace = undefined }:
            { status?: number; result?: any | any[]; resultType?: string; message?: string | undefined, stacktrace?: any }
    ): object {
        console.log(resultType)
        return {
            message: message || (status >= 400 ? "An error occured" : null),
            [resultType ?? 'result']: Object.keys(result).length ?
                (result instanceof Array ? [...result] : { ...result })
                : (stacktrace || null)
        }
    }

    /**
     * Base route handler
     */
    base({ response }: { response: Response }) {
        response.body = this._render({
            message: 'Grand Theft Bootleg'
        })
    }
}