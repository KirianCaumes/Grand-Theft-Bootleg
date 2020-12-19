import Bootleg, { ErrorBootleg } from 'request/objects/bootleg'
import ApiManager from 'request/apiManager'
import { IncomingMessage } from 'http'
import { ErrorReport } from 'request/objects/report'
import BootlegMeta from 'request/objects/meta/bootlegMeta'

/**
 * BootlegManager
 * @extends {ApiManager<Bootleg, ErrorBootleg & ErrorReport, BootlegMeta>}
 */
export default class BootlegManager extends ApiManager {
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
     * @returns {Promise<Bootleg>}
     */
    click(id = undefined) {
        const request = this._getRequest({ url: [id, 'clicked'], method: "POST" })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Add report
     * @param {string} id 
     * @param {object} data
     * @returns {Promise<Bootleg>}
     */
    createReport(id = undefined, data = {}) {
        this.errorType = ErrorReport
        const request = this._getRequest({ url: [id, 'report'], method: "POST", data })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
                this.errorType = ErrorBootleg
            })
    }

    /**
     * Remove reports
     * @param {string} id 
     * @returns {Promise<Bootleg>}
     */
    removeReports(id = undefined) {
        this.errorType = ErrorReport
        const request = this._getRequest({ url: [id, 'report'], method: "DELETE" })

        return request.req
            .then(res => {
                return new (this.type)(res.data[this.objectName])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
                this.errorType = ErrorBootleg
            })
    }
}