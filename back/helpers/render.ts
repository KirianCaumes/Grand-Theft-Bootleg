import IApiError from "../types/interfaces/IApiError.ts"

/**
 * Render data
 * @param obj
 * @param obj.result
 * @param obj.message
 * @param obj.stacktrace
 */
export default function render({
    result = {},
    message = undefined,
    stacktrace = undefined,
    errors = [],
    resultKey = undefined
}:
    {
        result?: any | any[];
        message?: string | undefined;
        stacktrace?: any;
        errors?: IApiError[];
        resultKey?: string
    }
): object {
    const res = {
        message: message || null,
        [resultKey ?? 'result']: !!result && Object.keys(result).length ?
            (result instanceof Array ? [...result] : (typeof result === 'string' ? result : { ...result }))
            : (stacktrace || null)
    }

    if (errors.length)
        res.errors = errors

    return res
}