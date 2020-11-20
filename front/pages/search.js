import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"

/**
 * @typedef {object} SearchProps
 * @property {string} test Test
 */

/**
 * Search page
 * @param {GlobalProps & SearchProps} props 
 */
export default function Search({ test = "qsdqsd", ...props }) {
    return (
        <>
            <Head>
                <title>Search - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                Search here
            </main>
        </>
    )
}
