import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import mailValidation from "../helpers/validations/mail.validation.ts"
import passwordValidation from "../helpers/validations/password.validation.ts"
import { validator } from "./_base.validator.ts"

const userValidationSchema = Schema({
    // _id: string,
    mail: mailValidation,
    username: string.trim().normalize().between(2, 255),
    password: passwordValidation,

    // role: unknown.enum(EUserRoles)
})

type UserValidationType = Type<typeof userValidationSchema>

export const userValidator = (user: UserValidationType): UserValidationType =>
    validator<typeof userValidationSchema, UserValidationType>(userValidationSchema, user, 'User not modified or created')

export type UserValidatorType = typeof userValidator
