import React, { useEffect } from 'react'
import 'styles/index.scss'
import { AppProps } from 'next/dist/next-server/lib/router/router'
// @ts-ignore
import { Navbar } from 'react-bulma-components'
import Link from 'next/link'
import { Logo } from 'components/svg/icon'
import { wrapper } from 'redux/store'
import { setToken } from 'redux/slices/main'
import Cookie from 'helpers/cookie'
import { useDispatch, useStore } from 'react-redux'
import Layout from 'components/layout'

/**
 * @typedef {object} GlobalProps
 * @property {string} appname App name
 */

/**
 * Base layout
 * @param {AppProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps, main }) {
    const globalProps = {
        appname: "Grand Theft Bootleg"
    }
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(
            setToken({
                token: Cookie.get()
            })
        )
    }, [])

    return (
        <Layout>
            <Component {...{ ...pageProps, ...globalProps }} />
        </Layout>
    )
}

// MyApp.getInitialProps = async ({ Component, ctx }) => {
//     ctx.store.dispatch(
//         setToken({
//             token: Cookie.get(ctx.req)
//         })
//     )

//     return {
//         pageProps: {
//             ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
//         }
//     }
// }

export default wrapper.withRedux(MyApp)