import { Collection } from "https://deno.land/x/mongo@v0.12.1/ts/collection.ts"
import { client } from "./_dbConnector.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import { setExpiration, makeJwt } from "https://deno.land/x/djwt/create.ts"

export interface UserSchema {
    _id: { $oid: string }
    username: string
    password: string
    role: number
}

export class UsersCollection extends Collection<UserSchema> {
    constructor() {
        super(client, config()?.MONGO_DB, "users")
    }

    async getToken(user: UserSchema): Promise<string> {
        return await makeJwt({
            header: {
                alg: 'HS256',
                typ: 'JWT'
            },
            payload: {
                iss: JSON.stringify({ ...user, password: undefined }),
                exp: setExpiration(60 * 60)
            },
            key: config()?.JWT_KEY
        })
    }
}

export type UsersCollectionType = UsersCollection
