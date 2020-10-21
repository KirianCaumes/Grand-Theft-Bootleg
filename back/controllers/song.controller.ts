import BaseController from "./_base.controller.ts"
import { BootlegsCollectionType } from "../models/bootleg.model.ts"
import { getQuery } from "https://deno.land/x/oak@v6.3.1/helpers.ts"
import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts"

/**
 * Song Controller
 */
export default class SongController extends BaseController {
    private collection: BootlegsCollectionType

    /** @inheritdoc */
    resultKey: string = "song"

    constructor(collection: BootlegsCollectionType) {
        super()
        this.collection = collection
    }

    /**
     * Get songs
     */
    async getSongs(ctx: Context) {
        const { response } = ctx
        const { string } = getQuery(ctx)

        response.body = this._render({
            message: 'List of songs',
            result: await this.collection.findSongs(string)
        })
    }
}