import cookie from 'js-cookie'
import { IncomingMessage } from 'http'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

/**
 * Cookie Handler
 */
const Cookie = {
    /**
     * Set cookie
     * @param {string} value 
     * @param {string} key 
     */
    set(value, key = publicRuntimeConfig.storageKey) {
        // @ts-ignore
        if (process.browser && !!value)
            cookie.set(key, value, {
                expires: 1,
                path: '/',
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'lax'
            })
    },
    /**
     * Remove cookie
     * @param {string} key 
     */
    remove(key = publicRuntimeConfig.storageKey) {
        // @ts-ignore
        if (process.browser)
            cookie.remove(key, {
                expires: 1
            })
    },
    /**
     * Get cookie
     * @param {IncomingMessage=} req 
     * @param {string} key 
     */
    get(req, key = publicRuntimeConfig.storageKey) {
        // @ts-ignore
        return process.browser
            ?
            cookie.get(key) ?? null
            :
            req?.headers?.cookie
                ?.split(';')
                ?.find(c => c?.trim()?.startsWith(`${key}=`))
                ?.split('=')?.[1] ?? null
    }
}

export default Cookie