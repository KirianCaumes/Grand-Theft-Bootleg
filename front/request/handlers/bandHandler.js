import Band from 'request/objects/band'
import ApiHandler from 'request/apiHandler'
import { IncomingMessage } from 'http'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * BandHandler
 * @extends {ApiHandler<Band, null>}
 */
export default class BandHandler extends ApiHandler {
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
     * @returns {null}
     */
    getById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {null}
     */
    create() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {null}
     */
    updateById() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {null}
     */
    upsert() {
        throw new NotImplementedError()
    }

    /**
     * @override
     * @returns {null}
     */
    removeById() {
        throw new NotImplementedError()
    }
}