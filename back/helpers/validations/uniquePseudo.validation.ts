import { usersCollection } from "../../routers/_initialization.ts"

/** Check if valid pseudo */
export default async function uniquePseudoValidation(input: string): Promise<string> {
    if ((await usersCollection.find({ username: input })).length > 0)
        throw new TypeError(`Username already taken`)

    return input
}