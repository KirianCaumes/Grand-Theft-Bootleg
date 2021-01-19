import axios, { CancelTokenSource, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios' // eslint-disable-line
import { InvalidEntityError } from 'request/errors/invalidEntityError'
import { CancelRequestError } from 'request/errors/cancelRequestError'
import { UnauthorizedError } from './errors/unauthorizedError'
import Cookie from 'helpers/cookie'
import { IncomingMessage } from 'http'
import getConfig from 'next/config'
import { AuthentificationError } from './errors/authentificationError'
import { NotFoundError } from './errors/notFoundError'

const { publicRuntimeConfig } = getConfig()

/**
 * @template R
 * @typedef {{ fetch: () => Promise<R>; cancel: () => void; }} RequestApi
 */

/**
 * @template T, E, M
 * @abstract
 */
export default class ApiHandler {
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
     * Init a new request
     * @protected
     * @param {object} params
     * @param {(string | number)[]=} params.url
     * @param {AxiosRequestConfig['method']=} params.method
     * @param {AxiosRequestConfig['data']=} params.data
     * @param {AxiosRequestConfig['params']=} params.params
     * @param {AxiosRequestConfig['responseType']=} params.responseType
     * 
     * @typedef {object} HandlerRequest
     * @property {Promise<AxiosResponse>} fetchRequest
     * @property {CancelTokenSource} cancelToken
     * 
     * @returns {HandlerRequest}
     */
    initFetchRequest({ url = [], method = "GET", data = {}, params = {}, responseType = "json" }) {
        /** @type {CancelTokenSource} */
        const cancelToken = axios.CancelToken.source()

        return {
            fetchRequest: axios.request({
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
            cancelToken
        }
    }

    /**
     * @param {() => Promise<any>} req 
     * @param {CancelTokenSource} cancelToken 
     * @returns {RequestApi<any>}
    */
    getRequestApi(req, cancelToken) {
        return {
            fetch: () => req(),
            cancel: () => cancelToken.cancel('Operation canceled by the user.')
        }
    }

    /**
     * Get one by ID
     * @param id 
     * @returns {RequestApi<T>}
     */
    getById(id = undefined) {
        const request = this.initFetchRequest({ url: [id] })

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
     * Get all
     * @param {AxiosRequestConfig['params']=} params
     * @returns {RequestApi<[T[], M]>}
     */
    getAll(params = {}) {
        const request = this.initFetchRequest({ params })

        return this.getRequestApi(
            () => request.fetchRequest
                .then(res => {
                    return /** @type {[T[], M]} */ ([
                        res.data[this.objectName]?.map(x => new (this.type)(x)) ?? [],
                        this.metaType ? new (this.metaType)(res.data.meta) : null
                    ])
                })
                .catch(err => {
                    throw this._handleError(err)
                }),
            request.cancelToken
        )
    }

    /**
     * Create
     * @param {T} obj 
     * @returns {RequestApi<T>}
     */
    create(obj = new (this.type)()) {
        const request = this.initFetchRequest({ method: "POST", data: obj })

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
     * Update
     * @param {T} obj 
     * @returns {RequestApi<T>}
     */
    updateById(obj = new (this.type)(), id = undefined) {
        const request = this.initFetchRequest({ url: [id], method: "PUT", data: obj })

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
     * Upsert
     * @param {T} obj 
     * @param {number=} id 
     * @returns {RequestApi<T>}
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
     * @returns {RequestApi<T>}
     */
    removeById(id = undefined) {
        const request = this.initFetchRequest({ url: [id], method: "DELETE" })

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