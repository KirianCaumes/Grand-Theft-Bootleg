import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import uniqueMailValidation from "../helpers/validations/uniqueMail.validation.ts"
import uniquePseudoValidation from "../helpers/validations/uniquePseudo.validation.ts"
import passwordValidation from "../helpers/validations/password.validation.ts"
import { validator } from "./_base.validator.ts"

/**
 * Issue {@link https://github.com/neuledge/computed-types/issues/76}
 */
const userValidationSchema = Schema({
    // _id: string,
    mail: string.trim().normalize().between(5, 50).transform(uniqueMailValidation),
    username: string.trim().normalize().between(5, 15).transform(uniquePseudoValidation),
    password: string.trim().normalize().transform(passwordValidation),

    // role: unknown.enum(EUserRoles)
})

type UserValidationType = Type<typeof userValidationSchema>

export const userValidator = async (user: UserValidationType): Promise<UserValidationType> =>
    await validator<typeof userValidationSchema, UserValidationType>(userValidationSchema, user, 'User not modified or created')

export type UserValidatorType = typeof userValidator
