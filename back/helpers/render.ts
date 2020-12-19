import IApiError from "../types/interfaces/IApiError.ts"

/**
 * Render data
 * @param obj
 * @param obj.result
 * @param obj.message
 * @param obj.stacktrace
 * @param obj.meta Extra data
 */
export default function render({
    result = {},
    message = undefined,
    stacktrace = undefined,
    error = undefined,
    resultKey = undefined,
    meta = undefined
}:
    {
        result?: any | any[];
        message?: string | undefined;
        stacktrace?: any;
        error?: IApiError;
        resultKey?: string;
        meta?: any;
    }
): object {
    const res = {
        message: message || null,
        [resultKey ?? 'result']: !!result && Object.keys(result).length ?
            (result instanceof Array ? [...result] : (typeof result === 'string' ? result : { ...result }))
            : (stacktrace || null)
    }

    if (error)
        res.error = error

    if (meta)
        res.meta = meta

    return res
}