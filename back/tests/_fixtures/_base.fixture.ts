import { BootlegsCollection } from "../../models/bootleg.model.ts"
import { UsersCollection } from "../../models/user.model.ts"
// import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts"

export default abstract class BaseFixture {
    protected bootlegsCollection = new BootlegsCollection()
    protected usersCollection = new UsersCollection()

    constructor() { }

    /**
     * Get new item
     */
    getItem() { }

    /**
     * Init items in db
     */
    async load() { }

    /**
     * Delete items in db
     */
    async unload() { }
}