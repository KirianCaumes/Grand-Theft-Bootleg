import Schema, { string, Type, unknown } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import uniqueMailValidation from "../helpers/validations/uniqueMail.validation.ts"
import uniquePseudoValidation from "../helpers/validations/uniquePseudo.validation.ts"
import passwordValidation from "../helpers/validations/password.validation.ts"
import { validator } from "./_base.validator.ts"
import { EAuthStrategies } from "../types/enumerations/EAuthStrategies.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import getGoogleUser from "../helpers/stragies/getGoogleUser.ts"


/**
 * Issue {@link https://github.com/neuledge/computed-types/issues/76}
 */

const userValidationSchemaBase = {
    // _id: string,
    mail: string.trim().normalize().between(5, 50).transform(uniqueMailValidation),
    username: string.trim().normalize().between(5, 25).transform(uniquePseudoValidation),
    password: string.trim().normalize().transform(passwordValidation),
    strategy: unknown.enum(EAuthStrategies, arg => `Strategy ${EAuthStrategies[arg as number] ?? arg} is invalid`),

    strategyData: unknown
    // role: unknown.enum(EUserRoles)
}

//EAuthStrategies.CLASSIC
const userValidationSchema = Schema(userValidationSchemaBase)

type UserValidationType = Type<typeof userValidationSchema>

//EAuthStrategies.GOOGLE
const userValidationSchemaGoogle = Schema({
    ...userValidationSchemaBase,
    password: string.optional()
})

type UserValidationTypeGoogle = Type<typeof userValidationSchemaGoogle>

export const userValidator = async (user: UserValidationType | UserValidationTypeGoogle): Promise<UserValidationType | UserValidationTypeGoogle> => {
    switch (user.strategy) {
        case EAuthStrategies.CLASSIC:
            return await validator<typeof userValidationSchema, UserValidationType | UserValidationTypeGoogle>(userValidationSchema, user, 'User not modified or created')
        case EAuthStrategies.GOOGLE:
            const payload = await getGoogleUser(user)

            return await validator<typeof userValidationSchemaGoogle, UserValidationType | UserValidationTypeGoogle>(
                userValidationSchemaGoogle,
                {
                    ...user,
                    mail: payload.email,
                    username: (() => {
                        if (payload.name?.length > 25)
                            return payload.name?.substring(0, 25)
                        else if (payload.name?.length < 5)
                            return `${payload.name}${'_'.repeat(5 - payload.name?.length)}`
                        return payload.name
                    })(),
                    password: undefined,
                },
                'User not modified or created'
            )
        case EAuthStrategies.TWITTER:
        case EAuthStrategies.FACEBOOK:
        default:
            throw new ValidationException(
                'User not modified or created',
                { strategy: 'Invalid authentification strategy' }
            )
    }
}

export type UserValidatorType = typeof userValidator
