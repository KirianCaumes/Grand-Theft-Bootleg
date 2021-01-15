import Song from 'request/objects/song'
import ApiManager from 'request/apiManager'
import { IncomingMessage } from 'http'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * SongManager
 * @extends {ApiManager<Song, null>}
 */
export default class SongManager extends ApiManager {
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