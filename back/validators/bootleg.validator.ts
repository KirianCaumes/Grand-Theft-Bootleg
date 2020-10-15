import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import ValidationException, { ValidationRow } from "../types/exceptions/ValidationException.ts"

export const bootlegValidationSchema = Schema({
    // _id: string,
    title: string.trim().normalize().between(3, 40),
    description: string.trim().normalize()
})

export type BootlegValidationType = Type<typeof bootlegValidationSchema>

export const bootlegValidator = (bootleg: BootlegValidationType): BootlegValidationType => {
    const [err, res] = bootlegValidationSchema.destruct()(bootleg)
    if (err)
        throw new ValidationException(err?.errors?.map(x => new ValidationRow(x.error.message, x.path as string[])))
    return res as BootlegValidationType
}

export type BootlegValidatorType = typeof bootlegValidator
