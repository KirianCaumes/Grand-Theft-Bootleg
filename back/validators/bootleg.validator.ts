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
    description: string.trim().normalize().between(0, 500),
    date: string.trim().normalize().transform(dateValidation),
    picture: string.trim().normalize().transform(urlValidation),
    links: array.of(string.trim().normalize().transform(urlValidation), () => `Invalid URLs`).between(1, 10),
    bands: array.of(string.normalize()).between(1, 10),
    songs: array.of(string.normalize()).between(1, 30),
    countries: array.of(Schema.enum(ECountries), arg => `Country ${arg} is invalid`).min(1).max(10),
    cities: array.of(string.normalize()).min(0).max(10),
    isCompleteShow: unknown.boolean('Expected value to be "True" or "False"'),
    isAudioOnly: unknown.boolean('Expected value to be "True" or "False"'),
    isProRecord: unknown.boolean('Expected value to be "True" or "False"'),
    soundQuality: number.between(1, 5),
    videoQuality: number.between(1, 5).optional(),
    state: unknown.enum(EBootlegStates, arg => `State ${EBootlegStates[arg as number]} is invalid`),

    // createdById: Schema({ $oid: string }).optional(),
    // createdOn: dateValidation,
    // modifiedById: Schema({ $oid: string }).optional(),
    // modifiedOn: dateValidation
}
const bootlegValidationSchema = Schema(bootlegValidationSchemaBase)

type BootlegValidationType = Type<typeof bootlegValidationSchema>

export const bootlegValidator = async (bootleg: BootlegValidationType, action?: EActions, user?: UserSchema): Promise<BootlegValidationType> => {
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

    const item = await validator<typeof bootlegValidationSchema, BootlegValidationType>(
        Schema({
            ...bootlegValidationSchemaBase,
            state: unknown.enum(myEnum, arg => `State ${EBootlegStates[arg as number]} is invalid`)
        }),
        bootleg,
        'Bootleg not modified or created'
    )

    if (item.isAudioOnly)
        item.videoQuality = null as any

    return item
}

export type BootlegValidatorType = typeof bootlegValidator
