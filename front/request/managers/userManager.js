import { User, ErrorUser } from 'request/objects/user'
import ApiManager from 'request/apiManager'
import { NotImplementedError } from 'request/errors/notImplementedError'

/**
 * UserManager
 * @extends {ApiManager<User, ErrorUser>}
 */
export default class UserManager extends ApiManager {
    constructor() {
        super({ type: User, errorType: ErrorUser, key: 'user' })
    }

    /**
     * Authentificate User
     * @param {object} data
     * @returns {Promise<User>}
     */
    login(data) {
        const request = this._getRequest({ url: ['login'], method: 'POST', data })

        return request.req
            .then(res => {
                return new (this.type)({ token: res.data.authToken })
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Get informations about current user
     * @returns {Promise<User>}
     */
    getMe() {
        const request = this._getRequest({ url: ['me'] })

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