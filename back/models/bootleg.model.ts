import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/ts/types.ts"
import { Collection } from "https://deno.land/x/mongo@v0.12.1/ts/collection.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import { client } from "./_dbConnector.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import { ESort } from "../types/enumerations/ESort.ts"

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
}

export class BootlegsCollection extends Collection<BootlegSchema> {
    constructor() {
        super(client, config()?.MONGO_DB, "bootlegs")
    }

    /**
     * Get one element by Id
     * @param id Id of the bootleg
     * {@link https://github.com/manyuanrong/deno_mongo/issues/89}
     */
    async findOneById(id: string): Promise<BootlegSchema> {
        try {
            const el = await this.findOne({ _id: ObjectId(id) })
            if (!el)
                throw new NotFoundException("Bootleg not found")
            return el
        } catch (error) {
            if (error?.message?.includes(" is not legal."))
                throw new NotFoundException("Bootleg not found")
            throw error
        }
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
     */
    async findAdvanced(
        { string, year, orderBy, band, song, country, isCompleteShow, isAudioOnly, isProRecord }:
            { string?: string; year?: number; orderBy?: string; band?: string; song?: string; country?: string; isCompleteShow?: boolean; isAudioOnly?: boolean; isProRecord?: boolean }
    ): Promise<BootlegSchema[]> {
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

        return this.aggregate([
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
                $sort: (() => {
                    switch (orderBy) {
                        case ESort.DATE_ASC:
                            return { date: -1 }
                        case ESort.DATE_DESC:
                            return { date: 1 }
                        default:
                            return { date: 1 }
                    }
                })()
            }
        ])
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
            { $limit: 50 },
            { $project: { category: 1, items: '$songs' } },
            { $unwind: '$items' },
            { $match: { 'items': { $regex: song, $options: "i" } } },
            { $group: { _id: null, items: { $addToSet: '$items' } } }
        ]) as any)?.[0]?.items
    }
}

export type BootlegsCollectionType = BootlegsCollection
