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
     */
    set(value) {
        // @ts-ignore
        if (process.browser)
            cookie.set(publicRuntimeConfig.storageKey, value, {
                expires: 1,
                path: '/',
                secure: process.env.NODE_ENV !== 'development'
            })
    },
    /**
     * Remove cookie
     */
    remove() {
        // @ts-ignore
        if (process.browser)
            cookie.remove(publicRuntimeConfig.storageKey, {
                expires: 1
            })
    },
    /**
     * Get cookie
     * @param {IncomingMessage=} req 
     */
    get(req) {
        // @ts-ignore
        return process.browser
            ?
            cookie.get(publicRuntimeConfig.storageKey) ?? null
            :
            req?.headers?.cookie
                ?.split(';')
                ?.find(c => c?.trim()?.startsWith(`${publicRuntimeConfig.storageKey}=`))
                ?.split('=')?.[1] ?? null
    }
}

export default Cookie