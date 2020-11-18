import BaseController from "./_base.controller.ts"
import { BootlegsCollectionType } from "../models/bootleg.model.ts"
import { getQuery } from "https://deno.land/x/oak@v6.3.2/helpers.ts"
import { Context } from "https://deno.land/x/oak@v6.3.2/context.ts"

/**
 * Band Controller
 */
export default class BandController extends BaseController {
    private collection: BootlegsCollectionType

    /** @inheritdoc */
    resultKey: string = "band"

    constructor(collection: BootlegsCollectionType) {
        super()
        this.collection = collection
    }

    /**
     * Get bands
     */
    async getBands(ctx: Context) {
        const { response } = ctx
        const { string } = getQuery(ctx)

        response.body = this._render({
            message: 'List of bands',
            result: await this.collection.findBands(string)
        })
    }
}