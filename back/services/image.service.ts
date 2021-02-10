import { FormDataFile } from "https://deno.land/x/oak@v6.3.2/multipart.ts"
import { v4 } from "https://deno.land/std@0.83.0/uuid/mod.ts"
import { BootlegSchema } from "../models/bootleg.model.ts"
import { env } from "../helpers/config.ts"

export default class ImageService {
    private path: string = `${Deno.cwd()}/public/images/`
    private baseUrlYt: string = "https://www.googleapis.com/youtube/v3"

    private generateName(ext: string): string {
        return `${v4.generate()}.${ext}`
    }

    async saveFile(file: FormDataFile): Promise<String> {
        //Generate file name
        const name = this.generateName(file?.originalName?.split('.')?.pop()!)

        //Save image on disk
        await Deno.writeFile(`${this.path}/${name}`, file?.content!)

        return name
    }

    async removeFile(fileName: string): Promise<any> {
        //Remove image
        await Deno.remove(`${this.path}/${fileName}`)
    }

    async extractYtThumbnail(bootlegBody: BootlegSchema): Promise<string | null> {
        if (bootlegBody.picture)
            return null

        for (const link of bootlegBody?.links) {
            const url = new URL(link)
            if (['youtube.com', 'www.youtube.com', 'www.youtu.be', 'youtu.be'].includes(url.host)) {
                //Get video/playlist id
                const id = url.href.includes('/playlist') ? url.searchParams.get('list') : (url.searchParams.get('v') ?? url.pathname?.replace('/', ''))

                if (!id)
                    return null

                //Get res
                const json = await (await fetch(`${this.baseUrlYt}/${url.href.includes('/playlist') ? 'playlists' : 'videos'}?${new URLSearchParams({
                    part: 'snippet',
                    id,
                    key: env.YOUTUBE_API_KEY!
                })}`)).json()

                const imgUrl = json?.items?.[0]?.snippet?.thumbnails?.high?.url

                if (!imgUrl)
                    return null

                //Get image
                const data = await (await fetch(imgUrl)).arrayBuffer()

                if (!data)
                    return null

                //Generate file name
                const name = this.generateName('jpg')

                //Save image on disk
                await Deno.writeFile(`${Deno.cwd()}/public/images/${name}`, new Uint8Array(data))

                return name
            }
        }

        return null
    }
}