import Schema, { array, boolean, number, string, Type, unknown } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import dateValidation from "../helpers/validations/date.validation.ts"
import urlValidation from "../helpers/validations/url.validation.ts"
import { UserSchema } from "../models/user.model.ts"
import { EActions } from "../types/enumerations/EActions.ts"
import { EBootlegStates, EBootlegStatesModerator, EBootlegStatesUser } from "../types/enumerations/EBootlegStates.ts"
import { ECountries } from "../types/enumerations/ECountries.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import { validator } from "./_base.validator.ts"

const bootlegValidationSchemaBase = {
    // _id: string,
    title: string.trim().normalize().between(5, 255),
    description: string.trim().normalize().between(0, 2550),
    date: dateValidation,
    picture: urlValidation,
    links: array.of(urlValidation).between(1, 10),
    bands: array.of(string).between(1, 10),
    songs: array.of(string).between(1, 30),
    countries: array.of(Schema.enum(ECountries)).min(1).max(10),
    cities: array.of(string).min(0).max(10),
    isCompleteShow: boolean,
    isAudioOnly: boolean,
    isProRecord: boolean,
    soundQuality: number.between(1, 10),
    videoQuality: number.between(1, 10),
    state: unknown.enum(EBootlegStates),

    // createdById: Schema({ $oid: string }).optional(),
    // createdOn: dateValidation,
    // modifiedById: Schema({ $oid: string }).optional(),
    // modifiedOn: dateValidation
}
const bootlegValidationSchema = Schema(bootlegValidationSchemaBase)

type BootlegValidationType = Type<typeof bootlegValidationSchema>

export const bootlegValidator = (bootleg: BootlegValidationType, action?: EActions, user?: UserSchema): BootlegValidationType => {
    //If user and action are defined we can custom 
    const myEnum = (() => {
        switch (action) {
            case EActions.CREATE:
            case EActions.UPDATE:
                switch (user?.role) {
                    case EUserRoles.VISITOR:
                    case EUserRoles.USER:
                        return EBootlegStatesUser
                    case EUserRoles.MODERATOR:
                    case EUserRoles.ADMIN:
                        return EBootlegStatesModerator
                    default:
                        return EBootlegStates
                }
            case EActions.READ:
            case EActions.DELETE:
            default:
                return EBootlegStates
        }
    })()

    return validator<typeof bootlegValidationSchema, BootlegValidationType>(
        Schema({
            ...bootlegValidationSchemaBase,
            state: unknown.enum(myEnum)
        }),
        bootleg,
        'Bootleg not modified or created'
    )
}

export type BootlegValidatorType = typeof bootlegValidator
