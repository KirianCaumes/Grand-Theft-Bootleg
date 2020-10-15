import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { EApiErrors } from "../types/enumerations/EApiErrors.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import IApiError from "../types/interfaces/IApiError.ts"

/**
 * Base Controller
 */
export default abstract class BaseController {
    /** Result key to use in render */
    resultKey: string = "result"

    constructor() { }

    /**
     * Render data
     * @protected
     * @param obj
     * @param obj.result
     * @param obj.message
     * @param obj.stacktrace
     */
    _render({
        result = {},
        message = undefined,
        stacktrace = undefined,
        errors = []
    }:
        {
            result?: any | any[];
            message?: string | undefined;
            stacktrace?: any;
            errors?: IApiError[]
        }
    ): object {
        const res = {
            message: message || null,
            [this.resultKey ?? 'result']: !!result && Object.keys(result).length ?
                (result instanceof Array ? [...result] : { ...result })
                : (stacktrace || null)
        }

        if (errors.length)
            res.errors = errors

        return res
    }

    /**
     * Handle error
     * @protected
     * @param error 
     * @param response
     */
    _handleError(error: any, response: Response): Response {
        switch (error?.constructor) {
            case NotFoundException:
                response.status = 404
                response.body = this._render({
                    message: `${this.resultKey.charAt(0).toUpperCase() + this.resultKey.slice(1)} not found`,
                    result: null
                })
                break
            case ValidationException:
                response.status = 400
                response.body = this._render({
                    message: `${this.resultKey.charAt(0).toUpperCase() + this.resultKey.slice(1)} not modified or created`,
                    errors: [{
                        code: EApiErrors.DATA_NOT_WELL_FORMATED,
                        validationResults: (error as ValidationException).validationRows
                    }],
                    result: null
                })
                break
            default:
                response.status = 500
                response.body = this._render({
                    message: error.message,
                    result: error.stack
                })
        }
        return response
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