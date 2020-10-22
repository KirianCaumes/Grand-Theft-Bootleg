import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import render from "../helpers/render.ts"
import { UserSchema } from "../models/user.model.ts"
import IApiError from "../types/interfaces/IApiError.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"
import { config } from "https://deno.land/x/dotenv@v0.5.0/mod.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"

/**
 * Base Controller
 */
export default abstract class BaseController {
    /** Result key to use in render */
    resultKey: string = "result"

    constructor() { }

    /**
     * Render data
     */
    protected _render({
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
     * Get user from request
     * @param request 
     */
    protected async _getUser(request: Request): Promise<UserSchema> {
        const usrStr = (await validateJwt({
            jwt: request.headers.get('Authorization')?.replace(/Bearer /, '')!,
            key: config()?.JWT_KEY,
            algorithm: 'HS256'
        }) as any).payload?.iss

        return usrStr ? JSON.parse(usrStr) : { _id: null, username: null, password: null, role: EUserRoles.VISITOR }
    }

    /**
     * Base route handler
     */
    public base({ response }: { response: Response }) {
        response.status = 404
        response.body = this._render({
            message: 'Grand Theft Bootleg'
        })
    }
}