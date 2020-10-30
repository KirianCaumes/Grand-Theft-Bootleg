import { BootlegsCollection } from "../../models/bootleg.model.ts"
import { UsersCollection } from "../../models/user.model.ts"
// import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/ts/types.ts"

export default abstract class BaseFixture {
    protected bootlegsCollection = new BootlegsCollection()
    protected usersCollection = new UsersCollection()

    constructor() { }

    async load() { }

    async unload() { }
}