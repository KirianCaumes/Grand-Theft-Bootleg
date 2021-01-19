import React from "react"
import { GetServerSidePropsContext } from 'next'
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/user/index-user.module.scss"
// @ts-ignore
import { Section, Container, Columns } from 'react-bulma-components'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import getConfig from 'next/config'
import { connect } from "react-redux"
import { Store, AnyAction } from "redux"
import { ReduxProps, wrapper } from 'redux/store'
import Link from "next/link"
import { MainState } from "redux/slices/main"
import { NotificationState } from 'redux/slices/notification'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { AuthentificationError } from "request/errors/authentificationError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotFoundError } from "request/errors/notFoundError"
import { NotImplementedError } from "request/errors/notImplementedError"
import BootlegHandler from "request/handlers/bootlegHandler"
import Bootleg from "request/objects/bootleg"
import { ESort } from "types/searchFilters/sort"
import { EStates } from "types/searchFilters/states"

/**
 * @typedef {object} IndexUserProps
 * @property {Bootleg[]} bootlegsPublishedProps Bootlegs from API
 * @property {Bootleg[]} bootlegsPendingProps Bootlegs from API
 * @property {Bootleg[]} bootlegsDraftProps Bootlegs from API
 */

/**
 * Index page
 * @param {IndexUserProps & HandlersProps & ReduxProps} props 
 */
function IndexUser({ main: { me }, bootlegsPublishedProps, bootlegsPendingProps, bootlegsDraftProps }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>Dashboard - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles['index-user']}>
                <Section>
                    <Container>
                        <Columns className="is-variable is-8">
                            <Columns.Column className="is-two-thirds">
                                <h1 className="title is-4 is-title-underline">
                                    <span className="is-capitalized">{me?.username}</span>'s dashboard
                                </h1>
                                <br />
                                <h2 className="title is-5 is-title-underline">
                                    Your last bootlegs published
                                </h2>
                                <Link
                                    href={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.PUBLISHED,
                                            authorId: me?._id
                                        }
                                    }}
                                >
                                    <a>
                                        See more &gt;
                                    </a>
                                </Link>
                                <br />
                                <br />
                                <h2 className="title is-5 is-title-underline">
                                    Your last bootlegs pending
                                </h2>
                                <Link
                                    href={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.PENDING,
                                            authorId: me?._id
                                        }
                                    }}
                                >
                                    <a>
                                        See more &gt;
                                    </a>
                                </Link>
                                <br />
                                <br />
                                <h2 className="title is-5 is-title-underline">
                                    Your last bootlegs draft
                                </h2>
                                <Link
                                    href={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.DRAFT,
                                            authorId: me?._id
                                        }
                                    }}
                                >
                                    <a>
                                        See more &gt;
                                    </a>
                                </Link>
                            </Columns.Column>
                            <Columns.Column className="is-one-third">
                                <h2 className="title is-5 is-title-underline">
                                    Your informations
                                </h2>
                                <p style={{ wordBreak: "break-word" }}>{JSON.stringify(me)}</p>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
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
    async ({ req, store }) => {
        const me = store.getState().main?.me

        try {
            const bootlegHandler = new BootlegHandler({ req })
            const [[bootlegsPublished], [bootlegsPending], [bootlegsDraft]] = await Promise.all([
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.PUBLISHED,
                    authorId: me?._id
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.PENDING,
                    authorId: me?._id
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.DRAFT,
                    authorId: me?._id
                }).fetch()
            ])

            return {
                props: {
                    bootlegsPublishedProps: bootlegsPublished.map(x => x.toJson()),
                    bootlegsPendingProps: bootlegsPending.map(x => x.toJson()),
                    bootlegsDraftProps: bootlegsDraft.map(x => x.toJson())
                }
            }
        } catch (error) {
            switch (error?.constructor) {
                case CancelRequestError:
                case UnauthorizedError:
                case AuthentificationError:
                case InvalidEntityError:
                case NotImplementedError:
                case NotFoundError:
                default:
                    console.log(error)
                    return {
                        props: {
                            bootlegsPopular: [],
                            bootlesgNew: [],
                            bootlegsRandom: []
                        }
                    }
            }
        }
    }
)

export default connect((state) => state)(withHandlers(IndexUser))