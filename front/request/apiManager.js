import axios, { CancelTokenSource, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios' // eslint-disable-line
import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { CancelRequestError } from 'request/errors/cancelRequestError'
// import { signOut } from 'redux/slices/user'
// import { setMessageBar } from 'redux/slices/common'
import { MessageBarType } from 'office-ui-fabric-react'
// import store from 'redux/store'
import { UnauthorizedError } from './errors/unauthorizedError'
import Cookie from 'helpers/cookie'
import { IncomingMessage } from 'http'
import getConfig from 'next/config'
import { store } from 'react-notifications-component'
import { AuthentificationError } from './errors/authentificationError'
import { NotFoundError } from './errors/notFoundError'

const { publicRuntimeConfig } = getConfig()

/**
 * @template T, E, M
 * @abstract
 */
export default class ApiManager {
    /**
     * @param {object} settings 
     * @param {object} settings.type Class to use
     * @param {object} settings.errorType Class to use for error
     * @param {object=} settings.metaType Class to use for meta data
     * @param {string} settings.key Object name used for base url and retrieve result
     * @param {IncomingMessage=} settings.req Request if from serverside, to retrieve token
     */
    constructor(settings) {
        /** 
         * Base URL used for each API call
         * @protected
         * @type {string} 
         */
        this.baseUrl = publicRuntimeConfig.apiUrl || `${origin}/api/`
        /** 
         * Type of object to return from API call
         * @protected
         * @type {T & Object} 
         */
        this.type = settings.type
        /** 
         * Type of error object to return from API call when fields are invalid
         * @protected
         * @type {E & Object} 
         */
        this.errorType = settings.errorType
        /** 
         * Type of object for meta data
         * @protected
         * @type {M & Object} 
         */
        this.metaType = settings.metaType
        /** 
         * Key to find in API call results
         * @protected
         * @type {string} 
         */
        this.objectName = settings.key?.toLowerCase()

        /** 
         * Request if from serverside, to retrieve token
         * @protected
         * @type {IncomingMessage} 
         */
        this.req = settings.req

        /** 
         * List of cancel tokens that can be canceled
         * @protected
         * @type {Object.<string, CancelTokenSource>}
         */
        this.cancelTokens = {}
    }

    /**
     * Cancel requests pending
     */
    cancel() {
        for (const index in this.cancelTokens) {
            this.cancelTokens[index].cancel('Operation canceled by the user.')
        }
    }

    /**
     * @protected
     * 
     * @typedef {object} ManagerCancelToken
     * @property {CancelTokenSource['token']} token
     * @property {string} cancelId
     * 
     * @returns {ManagerCancelToken}
     */
    _getCancelToken() {
        /** @type {CancelTokenSource} */
        const source = axios.CancelToken.source()

        const cancelId = new Date().getTime().toString()
        this.cancelTokens[cancelId] = source

        return {
            token: source.token,
            cancelId
        }
    }

    /**
     * @protected
     * @param {AxiosError} err 
     */
    _handleError(err) {
        if (axios.isCancel(err)) {
            return new CancelRequestError(err.message)
        } else if (err.response) {
            switch (err.response.status) {
                case 400:
                    switch (err.response.data?.error?.code) {
                        case 'data_not_well_formated':
                            return new InvalidEntityError({ content: err.response.data?.error, errorType: this.errorType })
                        default:
                            return new Error(err.response?.data?.message)
                    }
                case 401:
                    switch (err.response.data?.error?.code) {
                        case 'jwt_expired':
                            return new AuthentificationError(err.response.data?.error?.description ?? "You are not allowed to do this action")
                        default:
                            return new UnauthorizedError(err.response?.data?.message ?? "You are not allowed to do this action")
                    }
                case 403:
                    return new UnauthorizedError(err.response?.data?.message ?? "You are not allowed to do this action")
                case 404:
                    return new NotFoundError(err.response?.data?.message ?? "Item not found")
                case 500:
                    return new Error(err.response?.data?.toString() ?? "Something bad happened")
                default:
                    return new Error(err.response?.data?.toString() ?? "Something bad happened")
            }
        } else if (err.request) {
            return new Error(err.message?.toString())
        } else {
            return new Error(err.message?.toString())
        }
    }

    /**
     * Get a new request
     * @protected
     * @param {object} params
     * @param {(string | number)[]=} params.url
     * @param {AxiosRequestConfig['method']=} params.method
     * @param {AxiosRequestConfig['data']=} params.data
     * @param {AxiosRequestConfig['params']=} params.params
     * @param {AxiosRequestConfig['responseType']=} params.responseType
     * 
     * @typedef {object} ManagerRequest
     * @property {Promise<AxiosResponse>} req
     * @property {string} cancelTokenId
     * 
     * @returns {ManagerRequest}
     */
    _getRequest({ url = [], method = "GET", data = {}, params = {}, responseType = "json" }) {
        const cancelToken = this._getCancelToken()

        return {
            req: axios.request({
                baseURL: this.baseUrl,
                url: `${this.objectName}${url.length ? `/${url.join('/')}` : ''}`,
                method: method,
                cancelToken: cancelToken.token,
                data,
                params,
                headers: {
                    Authorization: `Bearer ${Cookie.get(this.req)}`
                },
                responseType: responseType
            }),
            cancelTokenId: cancelToken.cancelId
        }
    }

    /**
     * Get one by ID
     * @param id 
     * @returns {Promise<T>}
     */
    getById(id = undefined) {
        const request = this._getRequest({ url: [id] })

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
     * Get all
     * @param {AxiosRequestConfig['params']=} params
     * @returns {Promise<[T[], M]>}
     */
    getAll(params = {}) {
        const request = this._getRequest({ params })

        return request.req
            .then(res => {
                return /** @type {[T[], M]} */ ([
                    res.data[this.objectName]?.map(x => new (this.type)(x)) ?? [],
                    this.metaType ? new (this.metaType)(res.data.meta) : null
                ])
            })
            .catch(err => {
                throw this._handleError(err)
            })
            .finally(() => {
                delete this.cancelTokens[request.cancelTokenId]
            })
    }

    /**
     * Create
     * @param {T} obj 
     * @returns {Promise<T>}
     */
    create(obj = new (this.type)()) {
        const request = this._getRequest({ method: "POST", data: obj })

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
     * Update
     * @param {T} obj 
     * @returns {Promise<T>}
     */
    updateById(obj = new (this.type)(), id = undefined) {
        const request = this._getRequest({ url: [id], method: "PUT", data: obj })

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
     * Upsert
     * @param {T} obj 
     * @param {number=} id 
     * @returns {Promise<T>}
     */
    upsert(obj = new (this.type)(), id = undefined) {
        if (id) {
            return this.updateById(obj, id)
        } else {
            return this.create(obj)
        }
    }

    /**
     * Delete
     * @returns {Promise<T>}
     */
    removeById(id = undefined) {
        const request = this._getRequest({ url: [id], method: "DELETE" })

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