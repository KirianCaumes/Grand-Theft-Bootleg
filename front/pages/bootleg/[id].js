import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"

/**
 * @typedef {object} BootlegProps
 * @property {string} test Test
 */

/**
 * Bootleg page
 * @param {GlobalProps & BootlegProps} props 
 */
export default function Bootleg({ test = "qsdqsd", ...props }) {
    return (
        <>
            <Head>
                <title>Bootleg - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                Bootleg here
            </main>
        </>
    )
}
