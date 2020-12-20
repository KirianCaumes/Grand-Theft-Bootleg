import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/404.module.scss"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { faBackward, faHome } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import getConfig from 'next/config'
import { Logo } from "components/svg/icon"
import Button from "components/form/button"


export default function My404() {
    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()

    return (
        <>
            <Head>
                <title>404 - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles.notfound}>
                <Section>
                    <Container>
                        <Columns className="is-vcentered">
                            <Columns.Column
                                className="has-text-right"
                            >
                                <p className="title is-1">
                                    Grand Theft Bootleg
                                </p>
                                <p className="subtitle is-5" >
                                    Music and its hidden sides submerged.<br />
                                    What if we emerge them? 💿
                                </p>
                                <Logo width={85} fill="black" />
                            </Columns.Column>
                            <div className="is-divider-vertical" />
                            <Columns.Column>
                                <h1 className="title is-4 is-title-underline">
                                    <b>404</b> - Not found on <b>G</b>rand <b>T</b>heft <b>B</b>ootleg database
                                </h1>
                                <br />
                                <div className="field is-grouped">
                                    <p className="control">
                                        <Button
                                            label="Go back"
                                            iconLeft={faBackward}
                                            onClick={() => router.back()}
                                        />
                                    </p>
                                    <p className="control">
                                        <Button
                                            label="Go home"
                                            iconRight={faHome}
                                            onClick={() => router.push('/')}
                                        />
                                    </p>
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}