import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"

/**
 * @typedef {object} LoginProps
 * @property {string} test Test
 */

/**
 * Login page
 * @param {GlobalProps & LoginProps} props 
 */
export default function Login({ test = "qsdqsd", ...props }) {
    return (
        <>
            <Head>
                <title>Login - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                login here
            </main>
        </>
    )
}
