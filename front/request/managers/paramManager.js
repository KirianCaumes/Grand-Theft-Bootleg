import { Param } from 'request/objects/param'
import ApiManager from 'request/apiManager'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * ParamManager
 * @extends {ApiManager<Param, undefined>}
 */
export default class ParamManager extends ApiManager {
    constructor() {
        super({ type: Param, errorType: undefined, key: 'param' })
    }

    /**
     * Get params
     * @returns {Promise<Param>}
     */
    getParam() {
        const request = this._getRequest({})

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
     * @override
     * @returns {any}
     */
    getById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {any}
     */
    getAll() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {any}
     */
    create() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {any}
     */
    updateById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {any}
     */
    removeById() {
        throw new NotImplementedError()
    }
}