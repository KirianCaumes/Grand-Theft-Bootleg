import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

/**
 * Base component to render base HTML
 * @extends {Document}
 * @link https://nextjs.org/docs/advanced-features/custom-document
 */
export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html
                lang="en"
            >
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                    <link rel="manifest" href="/manifest.webmanifest" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <div id="modal-portal" />
                </body>
            </Html>
        )
    }
}