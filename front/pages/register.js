import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"

/**
 * @typedef {object} RegisterProps
 * @property {string} test Test
 */

/**
 * Register page
 * @param {GlobalProps & RegisterProps} props 
 */
export default function Register({ test = "qsdqsd", ...props }) {
    return (
        <>
            <Head>
                <title>Register - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                Register here
            </main>
        </>
    )
}
