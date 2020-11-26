import { UsersCollection } from "../../models/user.model.ts"

/** Check if valid mail */
export default async function uniqueMailValidation(input: unknown, key: string): Promise<string> {
    const str = (input as string)?.trim().normalize() ?? ''
    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(str?.toLowerCase() ?? '')
    )
        // throw new TypeError(`Invalid email`)
        throw {
            path: [key],
            error: new Error(`Invalid email`)
        }

    if ((await new UsersCollection().find({ mail: str })).length > 0)
        // throw new TypeError(`Email already taken`)
        throw {
            path: [key],
            error: new Error(`Email already taken`)
        }

    return str
}