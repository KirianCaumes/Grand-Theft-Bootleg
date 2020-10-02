import React from 'react'
import 'styles/index.scss'
import { AppProps } from 'next/dist/next-server/lib/router/router'

/**
 * @typedef {object} GlobalProps
 * @property {string} appname App name
 */

/**
 * Base layout
 * @param {AppProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
export default function MyApp({ Component, pageProps }) {
    const globalProps = {
        appname: "Grand Theft Bootleg"
    }

    return (
        <>
            <header>
                <nav>My navbar</nav>
            </header>
            <Component {...{ ...pageProps, ...globalProps }} />
            <footer>
                <nav>My footer</nav>
            </footer>
        </>
    )
}
