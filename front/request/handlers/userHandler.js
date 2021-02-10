import User, { ErrorUser } from 'request/objects/user'
import ApiHandler from 'request/apiHandler'
import { IncomingMessage } from 'http'
import { RequestApi } from 'request/apiHandler'

/**
 * UserHandler
 * @extends {ApiHandler<User, ErrorUser>}
 */
export default class UserHandler extends ApiHandler {
    /**
     * @param {object} param
     * @param {IncomingMessage=} param.req
     */
    constructor({ req } = {}) {
        super({
            type: User,
            errorType: ErrorUser,
            key: 'user',
            req
        })
    }

    /**
     * Authentificate User
     * @param {User} data
     * @returns {RequestApi<User>}
     */
    login(data) {
        const request = this.initFetchRequest({ url: ['login'], method: 'POST', data })

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
     * Get me user
     * @returns {RequestApi<User>}
     */
    getMe() {
        const request = this.initFetchRequest({ url: ['me'] })

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
     * Patch me
     * @param {User} obj 
     * @returns {RequestApi<User>}
     */
    patchMe(obj = new (this.type)()) {
        const request = this.initFetchRequest({ url: ['me'], method: "PATCH" })

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
     * Patch action user
     * @param {'password' | 'delete'} type 
     * @param {User=} obj 
     * @returns {RequestApi<null>}
     */
    sendMail(type, obj = new (this.type)()) {
        const request = this.initFetchRequest({ url: ['mail', type], method: "PATCH", data: obj })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(() => {
                    return null
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }

    /**
     * Patch action user
     * @param {string} token 
     * @param {'reset-pwd' | 'delete-account'} action 
     * @param {User=} obj 
     * @returns {RequestApi<null>}
     */
    patch(token, action, obj = new (this.type)()) {
        const request = this.initFetchRequest({ url: ['action', token, action], method: "PATCH", data: obj })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(() => {
                    return null
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }
}