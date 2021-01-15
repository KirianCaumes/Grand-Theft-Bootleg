import Band from 'request/objects/band'
import ApiManager from 'request/apiManager'
import { IncomingMessage } from 'http'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * BandManager
 * @extends {ApiManager<Band, null>}
 */
export default class BandManager extends ApiManager {
    /**
     * 
     * @param {object} param
     * @param {IncomingMessage=} param.req 
     */
    constructor({ req } = {}) {
        super({
            type: Band,
            errorType: null,
            key: 'band',
            req
        })
    }

    /**
     * @override
     * @returns {Promise<any>}
     */
    getById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {Promise<any>}
     */
    create() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {Promise<any>}
     */
    updateById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {Promise<any>}
     */
    upsert() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {Promise<any>}
     */
    removeById() {
        throw new NotImplementedError()
    }
}