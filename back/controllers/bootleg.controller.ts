import BaseController from "./_base.controller.ts"
import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"
import { Collection } from "https://deno.land/x/mongo@v0.12.1/ts/collection.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { BootlegSchema } from "../schemas/bootleg.model.ts"
import { BootlegValidatorType } from "../validators/bootleg.validator.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
/**
 * Bootleg Controller
 */
export default class BootlegController extends BaseController {
    collection: Collection<BootlegSchema>
    validate: BootlegValidatorType

    /** @inheritdoc */
    resultKey: string = "bootleg"

    /** Find one by Id handler helper */
    async findOneById(id: string): Promise<BootlegSchema> {
        try {
            const el = await this.collection.findOne({ _id: ObjectId(id) })
            if (!el) throw new NotFoundException()
            return el
        } catch (error) {
            if (error?.message?.includes(" is not legal.")) throw new NotFoundException()
            throw error
        }
    }

    constructor(collection: Collection<BootlegSchema>, validate: BootlegValidatorType) {
        super()
        this.collection = collection
        this.validate = validate
    }

    /**
     * Get all bootlegs from DB
     */
    async getAllBootlegs({ response }: { response: Response }) {
        response.body = this._render({
            message: 'List of bootlegs',
            result: await this.collection.find()
        })
    }

    /**
     * Get one bootleg by id
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async getBootleg({ params, response }: { params: { id: string }; response: Response }) {
        try {
            //Get element by id
            const bootleg = await this.findOneById(params.id)

            response.body = this._render({
                message: 'One bootleg',
                result: bootleg
            })
        } catch (error) {
            response = this._handleError(error, response)
        }
    }

    /**
     * Create a new bootleg
     */
    async addBootleg({ request, response }: { request: Request; response: Response }) {
        try {
            //Validate data
            const bootleg = this.validate(await request.body().value)

            //Insert new element and return id
            const id = (await this.collection.insertOne(bootleg)).$oid

            response.body = this._render({
                message: 'Bootleg added',
                result: {
                    ...bootleg,
                    _id: id
                }
            })
        } catch (error) {
            response = this._handleError(error, response)
        }
    }

    /**
     * Update an existing bootleg
     */
    async updateBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        try {
            //Get element by id
            await this.findOneById(params.id)

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
        } catch (error) {
            response = this._handleError(error, response)
        }
    }

    /**
     * Delete an existing bootleg
     */
    async deleteBootleg({ params, response }: { params: { id: string }; response: Response }) {
        try {
            //Get element by id
            await this.findOneById(params.id)

            //Remove by id
            await this.collection.deleteOne({ _id: ObjectId(params.id) })

            response.body = this._render({
                message: 'Bootleg removed'
            })
        } catch (error) {
            response = this._handleError(error, response)
        }
    }
}