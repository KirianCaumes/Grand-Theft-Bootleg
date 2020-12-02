import React, { useEffect } from 'react'
import 'styles/index.scss'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { wrapper } from 'redux/store'
import { setToken } from 'redux/slices/main'
import Cookie from 'helpers/cookie'
import { useDispatch } from 'react-redux'
import Layout from 'components/layout'

/**
 * Base layout
 * @param {AppProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch()

    useEffect(
        /** Component did mount */
        () => {
            dispatch(setToken({ token: Cookie.get() }))
        },
        []
    )

    return (
        <Layout>
            <Component {...pageProps} />
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