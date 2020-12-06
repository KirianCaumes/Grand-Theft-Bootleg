import React from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/create.module.scss"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import Bootleg from 'request/objects/bootleg'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
import getConfig from 'next/config'
import { wrapper } from "redux/store"
import { AnyAction, Store } from 'redux'
import { MainState } from "redux/slices/main"
import Cookie from "helpers/cookie"
import { setToken } from 'redux/slices/main'
import { NotificationState } from 'redux/slices/notification'

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootleg Bootleg
 */

/**
 * Bootleg page
 * @param {BootlegProps & ManagersProps} props 
 */
function Edit({ bootleg, bootlegManager, ...props }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>{bootleg.title} - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles.id}>
                Edit ...
            </main>
        </>
    )
}

/** Get server side props */
export const getServerSideProps = wrapper.getServerSideProps(
    /**
     * Get server side props
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; notification: NotificationState }, AnyAction>;}} ctx
     */
    async ({ query, req, store }) => {
        const token = Cookie.get(req)

        if (token)
            store.dispatch(setToken({ token }))

        if (!store.getState().main.token)
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }

        try {
            const bootlegManager = new BootlegManager({ req })
            const id = /** @type {string} */ (query.id)

            if (id === "new")
                return { props: { bootleg: {} } }

            const bootleg = await bootlegManager.getById(id?.substring(id?.lastIndexOf("-") + 1))

            return { props: { bootleg: JSON.parse(JSON.stringify(bootleg)) } }
        } catch (error) {
            console.log(error)
            return { notFound: true }
        }
    }
)

export default withManagers(Edit)