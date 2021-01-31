import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import passwordValidation from "../helpers/validations/password.validation.ts"
import { validator } from "./_base.validator.ts"

const userPasswordValidationSchema = Schema({
    password: string.trim().normalize().transform(passwordValidation),
})

type UserPasswordValidationType = Type<typeof userPasswordValidationSchema>

export const userPasswordValidator = async (userPassword: UserPasswordValidationType): Promise<UserPasswordValidationType> =>
    await validator<typeof userPasswordValidationSchema, UserPasswordValidationType>(userPasswordValidationSchema, userPassword, 'User password not modified')

export type UserPasswordValidatorType = typeof userPasswordValidator
