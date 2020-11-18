import BaseController from "./_base.controller.ts"
import { Response } from "https://deno.land/x/oak@v6.3.2/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.2/request.ts"
import { BootlegsCollectionType } from "../models/bootleg.model.ts"
import { BootlegValidatorType } from "../validators/bootleg.validator.ts"
import { getQuery } from "https://deno.land/x/oak@v6.3.2/helpers.ts"
import { Context } from "https://deno.land/x/oak@v6.3.2/context.ts"
import { EBootlegStates } from "../types/enumerations/EBootlegStates.ts"
import { EActions } from "../types/enumerations/EActions.ts"
import { ReportValidatorType } from "../validators/report.validator.ts"

/**
 * Bootleg Controller
 */
export default class BootlegController extends BaseController {
    private collection: BootlegsCollectionType
    private validateBootleg: BootlegValidatorType
    private validatorReport: ReportValidatorType

    /** @inheritdoc */
    resultKey: string = "bootleg"

    constructor(collection: BootlegsCollectionType, validateBootleg: BootlegValidatorType, validatorReport: ReportValidatorType) {
        super()
        this.collection = collection
        this.validateBootleg = validateBootleg
        this.validatorReport = validatorReport
    }

    /**
     * Get all bootlegs from DB
     */
    async getAllBootlegs(ctx: Context) {
        const { response } = ctx
        const { string, year, orderBy, band, song, country, isCompleteShow, isAudioOnly, isProRecord, startAt, limit, state, isRandom, authorId } = getQuery(ctx)

        //Get user
        const user = await this._getUser(ctx.request)

        response.body = this._render({
            message: 'List of bootlegs',
            result: await this.collection.findAdvanced({
                searchParams: {
                    string,
                    year: parseInt(year),
                    orderBy,
                    band,
                    song,
                    country,
                    isCompleteShow: isCompleteShow ? !!parseInt(isCompleteShow) : undefined,
                    isAudioOnly: isAudioOnly ? !!parseInt(isAudioOnly) : undefined,
                    isProRecord: isProRecord ? !!parseInt(isProRecord) : undefined,
                    startAt: !isNaN(parseInt(startAt)) ? parseInt(startAt) : undefined,
                    limit: !isNaN(parseInt(limit)) ? parseInt(limit) : undefined,
                    state: !isNaN(parseInt(state)) ? parseInt(state) : undefined,
                    isRandom: isRandom ? !!parseInt(isRandom) : undefined,
                    authorId
                },
                user
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
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.READ, bootlegBdd, user)

        response.body = this._render({
            message: 'One bootleg',
            result: bootlegBdd
        })
    }

    /**
     * Create a new bootleg
     */
    async addBootleg({ request, response }: { request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Validate data
        const bootlegBody = this.validateBootleg(await request.body().value, EActions.CREATE, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.CREATE, bootlegBody, user)

        //Insert new element and return id
        const bootlegBddUpd = await this.collection.createOn({
            ...bootlegBody,
            createdById: user._id,
            createdOn: new Date(),
            modifiedById: user._id,
            modifiedOn: new Date(),
        })

        response.body = this._render({
            message: 'Bootleg added',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * Update an existing bootleg
     */
    async updateBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Validate data
        const bootlegBody = this.validateBootleg(await request.body().value, EActions.UPDATE, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.UPDATE, bootlegBdd, user)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { ...bootlegBody, modifiedById: user._id, modifiedOn: new Date() } }
        )

        response.body = this._render({
            message: 'Bootleg edited',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * Delete an existing bootleg
     */
    async deleteBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.DELETE, bootlegBdd, user)

        //Set to state removed
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { state: EBootlegStates.DELETED, modifiedById: user._id, modifiedOn: new Date() } }
        )

        response.body = this._render({
            message: 'Bootleg removed',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * Create a report on a given bootleg
     */
    async addReport({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.CREATE_REPORT, bootlegBdd, user)

        //Validate data
        const reportBody = this.validatorReport(await request.body().value)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            {
                $push: {
                    report: {
                        userId: user._id,
                        date: new Date(),
                        ...reportBody
                    }
                }
            }
        )

        response.body = this._render({
            message: 'Report created',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * Create a report on a given bootleg
     */
    async clearReport({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.DELETE_REPORT, bootlegBdd, user)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { report: [] } }
        )

        response.body = this._render({
            message: 'Report cleared',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * When user click on the bootleg's url => Increase popularity
     */
    async clicked({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.CLICKED, bootlegBdd, user)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            {
                $push: {
                    clicked: {
                        userId: user._id,
                        date: new Date()
                    }
                }
            }
        )

        response.body = this._render({
            message: 'Bootleg clicked',
            result: {
                ...bootlegBddUpd
            }
        })
    }
}