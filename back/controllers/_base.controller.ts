import { Response } from "https://deno.land/x/oak@v6.3.2/response.ts"
import { verify } from "https://deno.land/x/djwt@v1.9/mod.ts"
import render from "../helpers/render.ts"
import { UserSchema } from "../models/user.model.ts"
import IApiError from "../types/interfaces/IApiError.ts"
import { Request } from "https://deno.land/x/oak@v6.3.2/request.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import { BootlegSchema } from "../models/bootleg.model.ts"
import { EActions } from "../types/enumerations/EActions.ts"
import BootlegVoter from "../voters/bootleg.voter.ts"
import BaseVoter from "../voters/_base.voter.ts"
import ForbiddenException from "../types/exceptions/ForbiddenException.ts"
import { env } from "../helpers/config.ts"

/**
 * Base Controller
 */
export default abstract class BaseController {
    /** Result key to use in render */
    protected resultKey: string = "result"

    private voters: BaseVoter[] = [new BootlegVoter()]

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
        try {
            const usrStr = (await verify(
                request.headers.get('Authorization')?.replace(/Bearer /, '')!,
                env?.JWT_KEY!,
                'HS512'
            ))?.iss
            return usrStr ? JSON.parse(usrStr) : { _id: null, username: null, password: null, role: EUserRoles.VISITOR }
        } catch (error) {
            return { _id: null, username: null, password: null, role: EUserRoles.VISITOR } as any
        }
    }

    /**
     * Deny access if user is not allowed
     * @param action 
     * @param subject 
     * @param user 
     */
    protected denyAccessUnlessGranted(action: EActions, subject: BootlegSchema | UserSchema | any, user: UserSchema) {
        for (const voter of this.voters) {
            if (voter.supports(action, subject) && !voter.voteOnAttribute(action, subject, user))
                throw new ForbiddenException()
        }
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