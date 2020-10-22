import BaseController from "./_base.controller.ts"
import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"
import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/mod.ts"
import { BootlegsCollectionType } from "../models/bootleg.model.ts"
import { BootlegValidatorType } from "../validators/bootleg.validator.ts"
import { getQuery } from "https://deno.land/x/oak@v6.3.1/helpers.ts"
import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts"
import { EBootlegStates } from "../types/enumerations/EBootlegStates.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"
import UnauthorizedException from "../types/exceptions/UnauthorizedException.ts"

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
        const { string, year, orderBy, band, song, country, isCompleteShow, isAudioOnly, isProRecord, startAt } = getQuery(ctx)

        response.body = this._render({
            message: 'List of bootlegs',
            result: await this.collection.findAdvanced({
                string,
                year: parseInt(year),
                orderBy,
                band,
                song,
                country,
                isCompleteShow: isCompleteShow ? !!parseInt(isCompleteShow) : undefined,
                isAudioOnly: isAudioOnly ? !!parseInt(isAudioOnly) : undefined,
                isProRecord: isProRecord ? !!parseInt(isProRecord) : undefined,
                startAt: !isNaN(parseInt(startAt)) ? parseInt(startAt) : undefined
            })
        })
    }

    /**
     * Get one bootleg by id
     */
    async getBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id)

        //Check if access
        if (
            bootlegBdd.state === EBootlegStates.DRAFT &&
            [EUserRoles.VISITOR, EUserRoles.USER].includes(user.role) &&
            bootlegBdd.createdById?.$oid !== user._id.$oid
        )
            throw new UnauthorizedException()

        response.body = this._render({
            message: 'One bootleg',
            result: bootlegBdd
        })
    }

    /**
     * Create a new bootleg
     */
    async addBootleg({ request, response }: { request: Request; response: Response }) {
        //Validate data
        const bootlegBody = this.validate(await request.body().value)

        //Get user
        const user = await this._getUser(request)

        //Check if good state
        if (
            !(
                [EBootlegStates.DRAFT, EBootlegStates.PENDING].includes(bootlegBody.state) &&
                [EUserRoles.USER].includes(user.role)
            ) &&
            !(
                [EBootlegStates.DRAFT, EBootlegStates.PENDING, EBootlegStates.PUBLISHED].includes(bootlegBody.state) &&
                [EUserRoles.MODERATOR, EUserRoles.ADMIN].includes(user.role)
            )
        )
            throw new ValidationException(
                'Item not modified or created',
                { state: 'Invalide state value' }
            )

        //Insert new element and return id
        const id = (await this.collection.insertOne({
            ...bootlegBody,
            createdById: user._id,
            createdOn: new Date(),
            modifiedById: user._id,
            modifiedOn: new Date(),
        })).$oid

        response.body = this._render({
            message: 'Bootleg added',
            result: {
                _id: { $oid: id },
                ...bootlegBody,
                createdById: user._id,
                createdOn: new Date(),
                modifiedById: user._id,
                modifiedOn: new Date(),
            }
        })
    }

    /**
     * Update an existing bootleg
     */
    async updateBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id)

        //Validate data
        const bootlegBody = this.validate(await request.body().value)

        //Get user
        const user = await this._getUser(request)

        //Check if access
        if (user.role === EUserRoles.USER && bootlegBdd.createdById?.$oid !== user._id.$oid)
            throw new UnauthorizedException()

        //Check if good state
        if (
            !(
                [EBootlegStates.DRAFT, EBootlegStates.PENDING].includes(bootlegBody.state) &&
                [EUserRoles.USER].includes(user.role)
            ) &&
            !(
                [EBootlegStates.DRAFT, EBootlegStates.PENDING, EBootlegStates.PUBLISHED].includes(bootlegBody.state) &&
                [EUserRoles.MODERATOR, EUserRoles.ADMIN].includes(user.role)
            )
        )
            throw new ValidationException(
                'Item not modified or created',
                { state: 'Invalide state value' }
            )

        //Update element
        await this.collection.updateOneById(
            params.id,
            { ...bootlegBody, modifiedById: user._id, modifiedOn: new Date() }
        )

        response.body = this._render({
            message: 'Bootleg edited',
            result: {
                _id: bootlegBdd._id,
                ...bootlegBody,
                modifiedById: user._id,
                modifiedOn: new Date()
            }
        })
    }

    /**
     * Delete an existing bootleg
     */
    async deleteBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id)

        //Get user
        const user = await this._getUser(request)

        //Check if access
        if (user.role === EUserRoles.USER && bootlegBdd.createdById?.$oid !== user._id.$oid)
            throw new UnauthorizedException()

        //Set to state removed
        await this.collection.updateOneById(
            params.id,
            { state: EBootlegStates.DELETED, modifiedById: user._id, modifiedOn: new Date() }
        )

        response.body = this._render({
            message: 'Bootleg removed'
        })
    }
}