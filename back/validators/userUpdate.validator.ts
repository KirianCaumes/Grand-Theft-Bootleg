import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import uniquePseudoValidation from "../helpers/validations/uniquePseudo.validation.ts"
import { validator } from "./_base.validator.ts"

const userUpdateValidationSchema = Schema({
    // mail: string.trim().normalize().between(5, 50).transform(uniqueMailValidation),
    username: string.trim().normalize().between(5, 25).transform(uniquePseudoValidation),
})

type UserUpdateValidationType = Type<typeof userUpdateValidationSchema>

export const userUpdateValidator = async (userUpdate: UserUpdateValidationType): Promise<UserUpdateValidationType> =>
    await validator<typeof userUpdateValidationSchema, UserUpdateValidationType>(userUpdateValidationSchema, userUpdate, 'User not modified')

export type UserUpdateValidatorType = typeof userUpdateValidator
