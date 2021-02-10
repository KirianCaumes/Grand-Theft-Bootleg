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

/**
 * Base layout
 * @param {AppProps & HandlersProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }) {
    const dispatch = useDispatch()

    useEffect(
        () => {
            dispatch(setToken({ token: Cookie.get() }))
        },
        []
    )

    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Message />
        </>
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

export default wrapper.withRedux(withHandlers(MyApp))