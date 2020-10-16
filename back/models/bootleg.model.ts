import { ObjectId } from "https://deno.land/x/mongo@v0.12.1/ts/types.ts"
import { Collection } from "https://deno.land/x/mongo@v0.12.1/ts/collection.ts"
import NotFoundException from "../types/exceptions/NotFoundException.ts"
import { client } from "./_dbConnector.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"

interface BootlegSchema {
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
}

export type BootlegsCollectionType = BootlegsCollection
