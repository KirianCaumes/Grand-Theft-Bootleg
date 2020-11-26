import { usersCollection } from "../../routers/_initialization.ts"

/** Check if valid mail */
export default async function uniqueMailValidation(input: string): Promise<string> {
    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(input?.toLowerCase() ?? '')
    )
        throw new TypeError(`Invalid email`)

    if ((await usersCollection.find({ mail: input })).length > 0)
        throw new TypeError(`Email already taken`)

    return input
}