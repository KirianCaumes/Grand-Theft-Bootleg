import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts"
import { Collection, WithID } from "https://deno.land/x/mongo@v0.13.0/ts/collection.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import { client } from "./_dbConnector.ts"
import { ESort } from "../types/enumerations/ESort.ts"
import { EBootlegStates } from "../types/enumerations/EBootlegStates.ts"
import { UserSchema } from "./user.model.ts"
import { env } from "../helpers/config.ts"
import { EUserRoles } from "../types/enumerations/EUserRoles.ts"

export interface BootlegSchema {
    _id: { $oid: string }
    title: string
    description: string
    date: Date
    picture: string
    links: string[]
    bands: string[]
    songs: string[]
    countries: string[]
    cities: string[]
    isCompleteShow: boolean
    isAudioOnly: boolean
    isProRecord: boolean
    soundQuality: number
    videoQuality: number
    state: number

    createdById: UserSchema['_id']
    createdOn: Date
    modifiedById: UserSchema['_id']
    modifiedOn: Date

    clicked: [
        {
            userId: UserSchema['_id']
            date: Date
        }
    ]

    report: [
        {
            userId: UserSchema['_id']
            date: Date
            message: string
        }
    ]
}

export class BootlegsCollection extends Collection<BootlegSchema> {
    /** Limit to searchin db */
    limit: number = 50

    constructor() {
        super(client, env?.MONGO_DB!, "bootlegs")
    }

    /**
     * Clear fields
     */
    private _setupClear(user?: UserSchema) {
        const clear = [
            { $addFields: { "createdBy.password": null } },
            { $addFields: { "modifiedBy.password": null } },
        ]

        //Clear some fields by roles
        if (!user || ![EUserRoles.ADMIN, EUserRoles.MODERATOR].includes(user?.role)) {
            clear.push({ $addFields: { "report": [] } } as any)
            clear.push({ $addFields: { "clicked": [] } } as any)
        }

        return clear
    }

    /**
     * About relations
     */
    private _setupRelations() {
        return [
            {
                $lookup: {
                    from: "users",
                    localField: "createdById",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            {
                $addFields: {
                    createdBy: {
                        $ifNull: [{ $arrayElemAt: ["$createdBy", 1] }, {}]
                    }
                }
            },
            {
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "modifiedById",
                    foreignField: "_id",
                    as: "modifiedBy"
                }
            },
            {
                $addFields: {
                    modifiedBy: {
                        $ifNull: [{ $arrayElemAt: ["$modifiedBy", 1] }, {}]
                    }
                }
            },
            {
                $unwind: {
                    path: '$modifiedBy', preserveNullAndEmptyArrays: true
                }
            },
        ]
    }

    /**
     * Get one element by Id
     * @param id Id of the bootleg
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async findOneById(id: string, user?: UserSchema): Promise<BootlegSchema> {
        try {
            const el = (await this.aggregate([
                { $match: { _id: ObjectId(id) } },
                ...this._setupRelations(),
                ...this._setupClear(user)
            ]))?.[0]

            if (!el)
                throw new NotFoundException("Bootleg not found")

            return el as BootlegSchema
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Bootleg not found")
            throw error
        }
    }

    /**
     * Update one element by Id
     * @param id Id of the bootleg
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async updateOneById(id: string, update: any): Promise<BootlegSchema> {
        try {
            const el = await this.updateOne(
                { _id: ObjectId(id) },
                update
            )

            if (!el)
                throw new NotFoundException("Bootleg not found")

            return await this.findOneById(id)
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Bootleg not found")
            throw error
        }
    }

    /**
     * Update one element by Id
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async createOn(insert: any): Promise<BootlegSchema> {
        return await this.findOneById(
            (await this.insertOne(insert))?.$oid
        )
    }

    /**
     * Advanced string
     * @param string String to search
     * @param year Year to search
     * @param orderBy Order by
     * @param band Bande name
     * @param song Song Name
     * @param country Country
     * @param isCompleteShow Is show complete, 1 or 0
     * @param isAudioOnly Is audio only, 1 or 0
     * @param isProRecord Is prop record, 1 or 0
     * @param startAt Start at index
     * @param limit Limit to search
     */
    async findAdvanced({
        searchParams: {
            string,
            year,
            orderBy,
            band,
            song,
            country,
            isCompleteShow,
            isAudioOnly,
            isProRecord,
            startAt = 0,
            limit,
            state = EBootlegStates.PUBLISHED,
            isRandom = false,
            authorId
        },
        user
    }: {
        searchParams: {
            string?: string;
            year?: number;
            orderBy?: string;
            band?: string;
            song?: string;
            country?: string;
            isCompleteShow?: boolean;
            isAudioOnly?: boolean;
            isProRecord?: boolean;
            startAt?: number;
            limit?: number;
            state?: EBootlegStates;
            isRandom?: boolean;
            authorId?: string;
        }
        user?: UserSchema
    }): Promise<BootlegSchema[]> {
        //Filter to query
        let $match = {}

        //To match string
        if (string)
            $match = {
                ...$match,
                $or: [
                    { title: { $regex: string, $options: "i" } },
                    { description: { $regex: string, $options: "i" } },
                    { songs: { $in: [{ $regex: string, $options: "i" }] } },
                    { bands: { $in: [{ $regex: string, $options: "i" }] } },
                ]
            }

        //To match bands
        if (band)
            $match = {
                ...$match,
                bands: {
                    $in: [{ $regex: band, $options: "i" }]
                }
            }

        //To match songs
        if (song)
            $match = {
                ...$match,
                songs: { $in: [{ $regex: song, $options: "i" }] }
            }

        //To match country
        if (country)
            $match = {
                ...$match,
                countries: { $in: [{ $regex: country, $options: "i" }] }
            }

        //To match isCompleteShow
        if (isCompleteShow !== undefined)
            $match = {
                ...$match,
                isCompleteShow: { $eq: isCompleteShow }
            }

        //To match isAudioOnly
        if (isAudioOnly !== undefined)
            $match = {
                ...$match,
                isAudioOnly: { $eq: isAudioOnly }
            }

        //To match isProRecord
        if (isProRecord !== undefined)
            $match = {
                ...$match,
                isProRecord: { $eq: isProRecord }
            }

        //To match year
        if (year)
            $match = {
                ...$match,
                date: {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                }
            }

        //To match author
        if (authorId)
            try {
                $match = {
                    ...$match,
                    createdById: { $eq: ObjectId(authorId) }
                }
            } catch (error) { }

        return this.aggregate([
            //Match disired state
            ...(() => {
                switch (user?.role) {
                    case EUserRoles.USER:
                        switch (state) {
                            case EBootlegStates.DRAFT:
                            case EBootlegStates.PENDING:
                                return [
                                    { $match: { state } },
                                    { $match: { createdById: user._id } }
                                ]
                            case EBootlegStates.PUBLISHED:
                            case EBootlegStates.DELETED:
                            default:
                                return [{ $match: { state: EBootlegStates.PUBLISHED } }]
                        }
                    case EUserRoles.MODERATOR:
                    case EUserRoles.ADMIN:
                        return [{ $match: { state } }]
                    case EUserRoles.VISITOR:
                    default:
                        return [{ $match: { state: EBootlegStates.PUBLISHED } }]
                }
            })(),
            {
                $addFields: {
                    date: {
                        /** 
                         * Transform date to string to be able to filter on
                         * {@see https://github.com/manyuanrong/deno_mongo/issues/59} 
                         */
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date"
                        }
                    }
                }
            },
            { $match },
            {
                $addFields: {
                    clickedCount: {
                        $size: {
                            "$ifNull": ["$clicked", []]
                        }
                    }
                }
            },
            {
                $sort: (() => {
                    switch (orderBy) {
                        case ESort.DATE_ASC:
                            return { date: 1 }
                        case ESort.DATE_DESC:
                            return { date: -1 }
                        case ESort.DATE_CREATION_ASC:
                            return { createdOn: 1 }
                        case ESort.DATE_CREATION_DESC:
                            return { createdOn: -1 }
                        case ESort.CLICKED_ASC:
                            return { clickedCount: 1 }
                        case ESort.CLICKED_DESC:
                            return { clickedCount: -1 }
                        default:
                            return { date: 1 }
                    }
                })()
            },
            //Get random item
            (() => isRandom ? { $sample: { size: (limit || this.limit) } } : {})(),
            { $limit: startAt + (limit || this.limit) },
            { $skip: startAt },
            ...this._setupRelations(),
            ...this._setupClear(user)
        ].filter(x => Object.keys(x).length))
    }

    /**
     * Find all existing bands on bootleg
     * @param band 
     */
    async findBands(band: string): Promise<string[]> {
        if (!band || band.length < 3)
            return []

        return (await this.aggregate([
            { $sort: { date: 1 } },
            { $match: { bands: { $in: [{ $regex: band, $options: "i" }] } } },
            { $match: { state: EBootlegStates.PUBLISHED } },
            { $limit: 50 },
            { $project: { category: 1, items: '$bands' } },
            { $unwind: '$items' },
            { $match: { 'items': { $regex: band, $options: "i" } } },
            { $group: { _id: null, items: { $addToSet: '$items' } } }
        ]) as any)?.[0]?.items
    }

    /**
     * Find all existing songs on bootleg
     * @param song 
     */
    async findSongs(song: string): Promise<string[]> {
        if (!song || song.length < 3)
            return []

        return (await this.aggregate([
            { $sort: { date: 1 } },
            { $match: { songs: { $in: [{ $regex: song, $options: "i" }] } } },
            { $match: { state: EBootlegStates.PUBLISHED } },
            { $limit: 50 },
            { $project: { category: 1, items: '$songs' } },
            { $unwind: '$items' },
            { $match: { 'items': { $regex: song, $options: "i" } } },
            { $group: { _id: null, items: { $addToSet: '$items' } } }
        ]) as any)?.[0]?.items
    }
}

export type BootlegsCollectionType = BootlegsCollection
