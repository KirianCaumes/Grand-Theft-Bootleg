import ValidationException from "../types/exceptions/ValidationException.ts"

export const validator = <T, I>(bootlegValidationSchema: T | any, item: I, errorMessage?: string): I => {
    const [err, res] = bootlegValidationSchema.destruct()(item)
    if (err) {
        throw new ValidationException(
            errorMessage || 'Item not modified or created',
            err?.errors?.reduce((err: any, x: any) => ({ ...err, [x.path?.[0] ?? x.path]: x.error.message }), {})
        )
    }
    return res as I
}
