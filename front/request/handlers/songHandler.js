import Song from 'request/objects/song'
import ApiHandler from 'request/apiHandler'
import { IncomingMessage } from 'http'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * SongHandler
 * @extends {ApiHandler<Song, null>}
 */
export default class SongHandler extends ApiHandler {
    /**
     * 
     * @param {object} param
     * @param {IncomingMessage=} param.req 
     */
    constructor({ req } = {}) {
        super({
            type: Song,
            errorType: null,
            key: 'song',
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