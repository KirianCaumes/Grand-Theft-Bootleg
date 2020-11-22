import ValidationException from "../types/exceptions/ValidationException.ts"

export const validator = async <T, I>(schema: T | any, item: I, errorMessage?: string): Promise<I> => {
    const [err, res] = await schema.destruct()(item)
    if (err)
        throw new ValidationException(
            errorMessage || 'Item not modified or created',
            err?.errors?.reduce((err: any, x: any) => ({ ...err, [x.path?.[0] ?? x.path]: x.error?.message }), {})
        )

    return res as I
}
