import IBootleg from "../types/interfaces/IBootleg.ts"
import BootlegService from "../services/bootlegService.ts"
import BaseController from "./_base.controller.ts"
import { Response } from "https://deno.land/x/oak@v6.3.1/response.ts"
import { Request } from "https://deno.land/x/oak@v6.3.1/request.ts"

export default class BootlegController extends BaseController {
    bootlegService: BootlegService

    constructor(bootlegService: BootlegService) {
        super()
        this.bootlegService = bootlegService
    }

    getBootlegs({ response }: { response: Response }) {
        response.body = this._render({
            message: 'List of bootlegs',
            result: this.bootlegService.getAll(),
            resultType: 'bootleg'
        })
    }

    getBootleg({ params, response }: { params: { id: string }; response: Response }) {
        const bootleg: IBootleg | undefined = this.bootlegService.findById(parseInt(params.id))
        if (bootleg) {
            response.status = 200
            response.body = this._render({
                message: 'One bootleg',
                result: bootleg,
                resultType: 'bootleg'
            })
        } else {
            response.status = 404
            response.body = this._render({
                message: 'Bootleg not found'
            })
        }
    }

    async addBootleg({ request, response }: { request: Request; response: Response }) {
        const body = await request.body()
        const bootleg: IBootleg = await body.value
        console.log(bootleg)
        this.bootlegService.add(bootleg)
        response.body = this._render({
            message: 'Bootleg added',
            result: bootleg,
            resultType: 'bootleg'
        })
        response.status = 200
    }


    async updateBootleg({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
        let bootleg: IBootleg | undefined = this.bootlegService.findById(parseInt(params.id))
        if (bootleg) {
            const body = await request.body()
            const updateInfos: { author?: string; title?: string } = await body.value
            const bootlegUpd = this.bootlegService.updateById(parseInt(params.id), updateInfos)
            response.status = 200
            response.body = this._render({
                message: 'Bootleg updated',
                result: bootlegUpd,
                resultType: 'bootleg'
            })
        } else {
            response.status = 404
            response.body = this._render({
                message: 'Bootleg not found'
            })
        }
    }


    deleteBootleg({ params, response }: { params: { id: string }; response: Response }) {
        this.bootlegService.removeById(parseInt(params.id))
        response.body = this._render({
            message: 'Bootleg remeoved'
        })
        response.status = 200
    }
}