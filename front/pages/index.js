import React from 'react'
import Head from 'next/head'
// @ts-ignore
import styles from 'styles/pages/index.module.scss'
import { GlobalProps } from "pages/_app"

/**
 * @typedef {object} IndexProps
 * @property {string} test Test
 */

/**
 * Index page
 * @param {GlobalProps & IndexProps} props 
 */
export default function Index({ test = "qsdqsd", ...props }) {
    return (
        <>
            <Head>
                <title>Home - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                <div>
                    <article>
                        Article 1
                    </article>
                    <article>
                        Article 2
                    </article>
                    <article>
                        Article 3
                    </article>
                </div>
                <aside>
                    Aside
                </aside>
            </main>
        </>
    )
}
