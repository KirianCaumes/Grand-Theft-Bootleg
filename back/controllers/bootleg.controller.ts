import BaseController from "./_base.controller.ts"
import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { BootlegsCollectionType } from "../models/bootleg.model.ts"
import { BootlegValidatorType } from "../validators/bootleg.validator.ts"
import { getQuery } from "https://deno.land/x/oak@v6.3.1/helpers.ts"
import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts"

/**
 * Bootleg Controller
 */
export default class BootlegController extends BaseController {
    private collection: BootlegsCollectionType
    private validate: BootlegValidatorType

    /** @inheritdoc */
    resultKey: string = "bootleg"

    constructor(collection: BootlegsCollectionType, validate: BootlegValidatorType) {
        super()
        this.collection = collection
        this.validate = validate
    }

    /**
     * Get all bootlegs from DB
     */
    async getAllBootlegs(ctx: Context) {
        const { response } = ctx
        const { string, year } = getQuery(ctx)

        // console.log({
        //     $gte: new Date(`${parseInt(year) - 1}-01-01T00:00:00.000Z`),
        //     $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`)
        // })

        const res = await this.collection.find({
            // date: {
            //     $gte: new Date(`2010-01-01T00:00:00.000Z`),
            //     // $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`)
            // }
        })

        response.body = this._render({
            message: 'List of bootlegs',
            result: res
        })
    }

    /**
     * Get one bootleg by id
     */
    async getBootleg({ params, response }: { params: { id: string }; response: Response }) {
        //Get element by id
        const bootleg = await this.collection.findOneById(params.id)

        response.body = this._render({
            message: 'One bootleg',
            result: bootleg
        })
    }

    /**
     * Create a new bootleg
     */
    async addBootleg({ request, response }: { request: Request; response: Response }) {
        //Validate data
        const bootleg = this.validate(await request.body().value)

        //Insert new element and return id
        const id = (await this.collection.insertOne(bootleg)).$oid

        response.body = this._render({
            message: 'Bootleg added',
            result: {
                _id: {
                    $oid: id
                },
                ...bootleg
            }
        })
    }

    /**
     * Update an existing bootleg
     */
    async updateBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get element by id
        await this.collection.findOneById(params.id)

        //Validate data
        const bootleg = this.validate(await request.body().value)

        //Update element
        await this.collection.updateOne({ _id: ObjectId(params.id) }, { $set: { ...bootleg } })

        response.body = this._render({
            message: 'Bootleg edited',
            result: {
                ...bootleg,
                _id: ObjectId(params.id)
            }
        })
    }

    /**
     * Delete an existing bootleg
     */
    async deleteBootleg({ params, response }: { params: { id: string }; response: Response }) {
        //Get element by id
        await this.collection.findOneById(params.id)

        //Remove by id
        await this.collection.deleteOne({ _id: ObjectId(params.id) })

        response.body = this._render({
            message: 'Bootleg removed'
        })
    }
}