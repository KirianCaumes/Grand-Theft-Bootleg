import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/general-conditions.module.scss"
// @ts-ignore
import { Section, Container } from 'react-bulma-components'
import getConfig from 'next/config'


export default function GeneralConditions() {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>General conditions - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="General conditions of Grand Theft Bootleg."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles['general-conditions']}>
                <Section>
                    <Container>
                        ...General Conditions
                    </Container>
                </Section>
            </main>
        </>
    )
}