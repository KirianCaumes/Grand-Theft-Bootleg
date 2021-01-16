import { Collection } from "https://deno.land/x/mongo@v0.13.0/ts/collection.ts"
import { client } from "./_dbConnector.ts"
import { create } from "https://deno.land/x/djwt@v1.9/mod.ts"
import { env } from "../helpers/config.ts"

export interface UserSchema {
    _id: { $oid: string }
    username: string
    mail: string
    password: string
    role: number
}

export class UsersCollection extends Collection<UserSchema> {
    constructor() {
        super(client, env?.MONGO_DB!, "users")
    }

    async getToken(user: UserSchema): Promise<string> {
        return await create(
            {
                alg: "HS512",
                typ: "JWT"
            },
            {
                iss: JSON.stringify({ ...user, password: undefined }),
                exp: Date.now() / 1000 + 60 * 60 * 24
            },
            env?.JWT_KEY!
        )
    }
}

export type UsersCollectionType = UsersCollection
