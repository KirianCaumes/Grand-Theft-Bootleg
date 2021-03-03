import React, { useEffect } from 'react'
import 'styles/index.scss'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { setToken } from 'redux/slices/main'
import Cookie from 'helpers/cookie'
import { useDispatch } from 'react-redux'
import Layout from 'components/layout'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import { wrapper } from 'redux/store'
import Message from 'components/general/message'
import GdprBanner from 'components/gdprBanner'
import TagManager from 'react-gtm-module'
import getConfig from 'next/config'

/**
 * Base layout
 * @param {AppProps & HandlersProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }) {
    const { publicRuntimeConfig } = getConfig()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setToken({ token: Cookie.get() }))
    }, [])

    // Google Tag Manager
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development' && !!publicRuntimeConfig.gtmId)
            TagManager.initialize({ gtmId: publicRuntimeConfig.gtmId })
    }, [publicRuntimeConfig])

    return (
        <>
            <GdprBanner />
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Message />
        </>
    )
}

export default wrapper.withRedux(withHandlers(MyApp))