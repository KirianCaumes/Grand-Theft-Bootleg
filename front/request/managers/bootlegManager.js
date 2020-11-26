import { Bootleg, ErrorBootleg } from 'request/objects/bootleg'
import ApiManager from 'request/apiManager'

/**
 * BootlegManager
 * @extends {ApiManager<Bootleg, ErrorBootleg>}
 */
export default class BootlegManager extends ApiManager {
    constructor() {
        super({ type: Bootleg, errorType: ErrorBootleg, key: 'bootleg' })
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
}