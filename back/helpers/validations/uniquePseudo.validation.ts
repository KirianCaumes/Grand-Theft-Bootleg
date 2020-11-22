import { UsersCollection } from "../../models/user.model.ts"

const usersCollection = new UsersCollection()

/** Check if valid pseudo */
export default async function uniquePseudoValidation(input: unknown, key: string): Promise<string> {
    const str = (input as string)?.trim().normalize() ?? ''

    if (str.length < 3 || str.length > 30)
        throw {
            path: [key],
            error: new Error(`Expect length to be between 3 and 30 characters (actual: ${str.length})`)
        }

    if ((await usersCollection.find({ username: str })).length > 0)
        throw {
            path: [key],
            error: new Error(`Username already taken`)
        }

    return input as string
}