import { client } from "./_dbConnector.ts"
import { create } from "https://deno.land/x/djwt@v1.9/mod.ts"
import { env } from "../helpers/config.ts"
import BaseCollection from "./_base.model.ts"

export interface UserSchema {
    _id: { $oid: string }
    username: string
    mail: string
    password: string | undefined
    role: number
    strategy: number

    createdOn: Date
    modifiedOn: Date

    resetPassword: {
        token: string
        expirationDate: Date
    } | undefined

    deleteAccount: {
        token: string
        expirationDate: Date
    } | undefined
}

export class UsersCollection extends BaseCollection<UserSchema> {
    constructor() {
        super(client, env?.MONGO_DB!, "users")
    }

    async getToken(user: any): Promise<string> {
        delete user.password
        delete user.resetPassword
        delete user.deleteAccount

        return await create(
            {
                alg: "HS512",
                typ: "JWT"
            },
            {
                iss: JSON.stringify(user),
                exp: Date.now() / 1000 + 60 * 60 * 24
            },
            env?.JWT_KEY!
        )
    }
}

export type UsersCollectionType = UsersCollection
