import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import render from "../helpers/render.ts"
import IApiError from "../types/interfaces/IApiError.ts"

/**
 * Base Controller
 */
export default abstract class BaseController {
    /** Result key to use in render */
    resultKey: string = "result"

    constructor() { }

    /**
     * @protected
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
            errors?: IApiError[];
        }
    ): object {
        return render({ result, message, stacktrace, errors, resultKey: this.resultKey })
    }

    /**
     * Base route handler
     */
    base({ response }: { response: Response }) {
        response.status = 404
        response.body = this._render({
            message: 'Grand Theft Bootleg'
        })
    }
}