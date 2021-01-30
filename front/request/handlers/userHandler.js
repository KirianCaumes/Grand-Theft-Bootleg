import User, { ErrorUser } from 'request/objects/user'
import ApiHandler from 'request/apiHandler'
import { RequestApi } from 'request/apiHandler'

/**
 * UserHandler
 * @extends {ApiHandler<User, ErrorUser>}
 */
export default class UserHandler extends ApiHandler {
    constructor() {
        super({ type: User, errorType: ErrorUser, key: 'user' })
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
     * Patch action user
     * @param {'password' | 'delete'} type 
     * @returns {RequestApi<User>}
     */
    sendMail(type) {
        const request = this.initFetchRequest({ url: ['me', 'mail', type], method: "PATCH" })

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
     * @param {User} obj 
     * @returns {RequestApi<User>}
     */
    patch(obj = new (this.type)()) {
        const request = this.initFetchRequest({ url: ['me'], method: "PATCH", data: obj })

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