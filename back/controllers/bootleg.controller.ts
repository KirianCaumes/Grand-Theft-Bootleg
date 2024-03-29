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
import { ESearch } from "../types/enumerations/ESsearch.ts"
import { FileValidatorType } from "../validators/file.validator.ts"
import ValidationException from "../types/exceptions/ValidationException.ts"
import ImageService from "../services/image.service.ts"

/**
 * Bootleg Controller
 */
export default class BootlegController extends BaseController {
    private collection: BootlegsCollectionType
    private validateBootleg: BootlegValidatorType
    private validatorReport: ReportValidatorType
    private validatorFile: FileValidatorType
    private imageService: ImageService

    /** @inheritdoc */
    resultKey: string = "bootleg"

    constructor(collection: BootlegsCollectionType, validateBootleg: BootlegValidatorType, validatorReport: ReportValidatorType, validatorFile: FileValidatorType, imageService: ImageService) {
        super()
        this.collection = collection
        this.validateBootleg = validateBootleg
        this.validatorReport = validatorReport
        this.validatorFile = validatorFile
        this.imageService = imageService
    }

    /**
     * Get all bootlegs from DB
     */
    async getAllBootlegs(ctx: Context) {
        const { response } = ctx
        const { string, year, orderBy, searchBy, country, isCompleteShow, isAudioOnly, isProRecord, page, limit, state, isRandom, authorId, isWithReport } = getQuery(ctx)

        //Set search params
        const searchParams = {
            string: string || '',
            year: parseInt(year),
            orderBy,
            searchBy: searchBy || ESearch.GLOBAL,
            country,
            isCompleteShow: isCompleteShow ? !!parseInt(isCompleteShow) : undefined,
            isAudioOnly: isAudioOnly ? !!parseInt(isAudioOnly) : undefined,
            isProRecord: isProRecord ? !!parseInt(isProRecord) : undefined,
            page: !isNaN(parseInt(page)) ? parseInt(page) : 1,
            limit: !isNaN(parseInt(limit)) ? parseInt(limit) : undefined,
            state: !isNaN(parseInt(state)) ? parseInt(state) : undefined,
            isRandom: isRandom ? !!parseInt(isRandom) : undefined,
            authorId,
            isWithReport: isWithReport ? !!parseInt(isWithReport) : undefined
        }

        //Get user
        const user = await this._getUser(ctx.request)

        const [result, totalGlobal, totalBand, totalSong] = await Promise.all([
            await this.collection.findAdvanced({ searchParams, user }),
            ((await this.collection.findAdvanced({ searchParams: { ...searchParams, searchBy: ESearch.GLOBAL, limit: undefined, page: undefined, isCount: true }, user }))?.[0] as any)?.count as number ?? 0,
            ((await this.collection.findAdvanced({ searchParams: { ...searchParams, searchBy: ESearch.BAND, limit: undefined, page: undefined, isCount: true }, user }))?.[0] as any)?.count as number ?? 0,
            ((await this.collection.findAdvanced({ searchParams: { ...searchParams, searchBy: ESearch.SONG, limit: undefined, page: undefined, isCount: true }, user }))?.[0] as any)?.count as number ?? 0,
        ])

        response.body = {
            ...this._render({
                message: 'List of bootlegs',
                result,
                meta: {
                    total: {
                        global: totalGlobal,
                        band: totalBand,
                        song: totalSong
                    },
                    page: {
                        current: searchParams.page,
                        last: Math.ceil(
                            (() => {
                                switch (searchBy) {
                                    case ESearch.BAND:
                                        return totalBand
                                    case ESearch.SONG:
                                        return totalSong
                                    case ESearch.GLOBAL:
                                    default:
                                        return totalGlobal
                                }
                            })() /
                            (searchParams.limit && searchParams.limit < this.collection.limit ? searchParams.limit : this.collection.limit)
                        )
                    }
                }
            }),

        }
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
        const bootlegBody = await this.validateBootleg(await request.body().value, EActions.CREATE, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.CREATE, bootlegBody, user)

        //Insert new element and return id
        let bootlegBddUpd = await this.collection.createOne({
            ...bootlegBody,
            createdById: user._id,
            createdOn: new Date(),
            modifiedById: user._id,
            modifiedOn: new Date(),
        })

        //Get picture if YT
        const picture = await this.imageService.extractYtThumbnail(bootlegBddUpd)

        //Update element
        if (picture)
            bootlegBddUpd = await this.collection.updateOneById(
                bootlegBddUpd._id?.$oid,
                { $set: { picture } }
            )

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
        const bootlegBody = await this.validateBootleg(await request.body().value, EActions.UPDATE, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.UPDATE, bootlegBdd, user)

        //Update element
        let bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { ...bootlegBody, modifiedById: user._id, modifiedOn: new Date() } }
        )

        //Get picture if YT
        const picture = await this.imageService.extractYtThumbnail(bootlegBddUpd)

        //Update element
        if (picture)
            bootlegBddUpd = await this.collection.updateOneById(
                bootlegBddUpd._id?.$oid,
                { $set: { picture } }
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
        const reportBody = await this.validatorReport(await request.body().value)

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

    /**
     * Upload an image
     */
    async uploadImage({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.UPDATE, bootlegBdd, user)

        //Deny if already a picture
        if (bootlegBdd?.picture)
            throw new ValidationException(
                'An image already exist',
                { picture: 'An image already exist' }
            )

        //Get formdata
        const formData = await request
            .body({ type: "form-data" })
            .value
            .read({ maxSize: 3000000 }) //Max 3mb

        //Setup file infos
        const file = formData.files?.[0]!

        //Validate data
        await this.validatorFile({ picture: file })

        //Save image on disk
        const name = await this.imageService.saveFile(file)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { picture: name } }
        )

        response.body = this._render({
            message: 'Image uploaded',
            result: {
                ...bootlegBddUpd
            }
        })
    }

    /**
     * Remove an image
     */
    async removeImage({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        //Get user
        const user = await this._getUser(request)

        //Get element by id
        const bootlegBdd = await this.collection.findOneById(params.id, user)

        //Check if has access
        this.denyAccessUnlessGranted(EActions.UPDATE, bootlegBdd, user)

        //Remove image
        await this.imageService.removeFile(bootlegBdd.picture)

        //Update element
        const bootlegBddUpd = await this.collection.updateOneById(
            params.id,
            { $set: { picture: null } }
        )

        response.body = this._render({
            message: 'Image deleted',
            result: {
                ...bootlegBddUpd
            }
        })
    }
}