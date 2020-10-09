import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"
import BootlegManager from "request/managers/bootlegManager"

/**
 * @typedef {object} IndexProps
 * @property {string} test Test
 */

/**
 * Index page
 * @param {GlobalProps & IndexProps} props 
 */
export default function Index({ test = "qsdqsd", ...props }) {
    //Component did mount
    useEffect(() => {
        (async () => {
            const bootlegManager = new BootlegManager()
            const bootlegs = await bootlegManager.getAll()
            console.log("bootlegs")
            console.log(bootlegs)
        })()
    }, [])
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
