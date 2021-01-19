import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/bootleg/index-bootleg.module.scss"
// @ts-ignore
import { Section, Container } from 'react-bulma-components'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import getConfig from 'next/config'
import { connect } from "react-redux"
import { ReduxProps } from 'redux/store'

/**
 * Index page
 * @param {HandlersProps & ReduxProps} props 
 */
function IndexBootleg({ ...props }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>What is a bootleg? - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles['index-bootleg']}>
                <Section>
                    <Container>
                        What is a bootleg?
                    </Container>
                </Section>
            </main>
        </>
    )
}

export default connect((state) => state)(withHandlers(IndexBootleg))