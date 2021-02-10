import Bootleg, { ErrorBootleg } from 'request/objects/bootleg'
import ApiHandler from 'request/apiHandler'
import { IncomingMessage } from 'http'
import { ErrorReport } from 'request/objects/report'
import BootlegMeta from 'request/objects/meta/bootlegMeta'
import { RequestApi } from 'request/apiHandler'

/**
 * BootlegHandler
 * @extends {ApiHandler<Bootleg, ErrorBootleg & ErrorReport, BootlegMeta>}
 */
export default class BootlegHandler extends ApiHandler {
    /**
     * 
     * @param {object} param
     * @param {IncomingMessage=} param.req 
     */
    constructor({ req } = {}) {
        super({
            type: Bootleg,
            errorType: ErrorBootleg,
            metaType: BootlegMeta,
            key: 'bootleg',
            req
        })
    }

    /**
     * Update
     * @param {string} id 
     * @returns {RequestApi<Bootleg>}
     */
    click(id = undefined) {
        const request = this.initFetchRequest({ url: [id, 'clicked'], method: "POST" })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return new (this.type)(res.data[this.objectName])
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }

    /**
     * Add report
     * @param {string} id 
     * @param {object} data
     * @returns {RequestApi<Bootleg>}
     */
    createReport(id = undefined, data = {}) {
        this.errorType = ErrorReport
        const request = this.initFetchRequest({ url: [id, 'report'], method: "POST", data })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return new (this.type)(res.data[this.objectName])
                })
                .catch(err => {
                    throw this._handleError(err)
                })
                .finally(() => {
                    this.errorType = ErrorBootleg
                }),
            request.cancelToken
        )
    }

    /**
     * Remove reports
     * @param {string} id 
     * @returns {RequestApi<Bootleg>}
     */
    removeReports(id = undefined) {
        this.errorType = ErrorReport
        const request = this.initFetchRequest({ url: [id, 'report'], method: "DELETE" })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return new (this.type)(res.data[this.objectName])
                })
                .catch(err => {
                    throw this._handleError(err)
                })
                .finally(() => {
                    this.errorType = ErrorBootleg
                }),
            request.cancelToken
        )
    }

    /**
     * Upload image
     * @param {File} file 
     * @param {string} id 
     * @returns {RequestApi<Bootleg>}
     */
    uploadImage(file, id = undefined) {
        const data = new FormData()
        data.append('file', file)

        const request = this.initFetchRequest({ url: [id, 'image'], method: "POST", data })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return new (this.type)(res.data[this.objectName])
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }

    /**
     * Remove image
     * @param {string} id 
     * @returns {RequestApi<Bootleg>}
     */
    removeImage(id = undefined) {
        const request = this.initFetchRequest({ url: [id, 'image'], method: "DELETE" })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return new (this.type)(res.data[this.objectName])
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }
}