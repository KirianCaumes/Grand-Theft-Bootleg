import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import BootlegHandler from "request/handlers/bootlegHandler"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake, faQuestion, faSearch, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import BootlegCard from "components/general/bootlegCard"
import { Logo } from "components/svg/icon"
import { useRouter } from 'next/router'
import Bootleg from 'request/objects/bootleg'
import Link from "next/link"
import config from 'react-reveal/globals'
import Fade from 'react-reveal/Fade'
import { ESort } from "types/searchFilters/sort"
import { wrapper } from "redux/store"
import { connect } from "react-redux"
import getConfig from 'next/config'
import { GetServerSidePropsContext } from 'next'
import { AnyAction, Store } from 'redux'
import { MainState } from "redux/slices/main"
import { NotificationState } from 'redux/slices/notification'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { AuthentificationError } from "request/errors/authentificationError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotFoundError } from "request/errors/notFoundError"
import { NotImplementedError } from "request/errors/notImplementedError"
import Button from "components/form/button"

config({ ssrFadeout: true })

/**
 * @typedef {object} IndexProps
 * @property {Bootleg[]} bootlegsPopularProps Bootlegs from API
 * @property {Bootleg[]} bootlegsNewProps Bootlegs from API
 * @property {Bootleg[]} bootlegsRandomProps Bootlegs from API
 */

/**
 * Index page
 * @param {IndexProps} props 
 */
function Index({ bootlegsPopularProps, bootlegsNewProps, bootlegsRandomProps, ...props }) {
    /** @type {[string, function(string):any]} Search text */
    const [searchText, setSearchText] = React.useState(null)

    const router = useRouter()
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>{publicRuntimeConfig.appName} - Discover unknown live bootlegs</title>
                <meta
                    name="description"
                    content="Music and its hidden sides submerged. What if we emerge them? 💿 Grand Theft Bootleg, help us bring out the bootlegs lost in the depths of the abyss! 🌊"
                />
            </Head>

            <main className={styles.index}>
                <Section className={styles.carousel} >
                    <Columns className="is-vcentered">
                        <Columns.Column
                            size="two-fifths"
                            className="is-hidden-mobile"
                        >
                            <p className="has-text-right" >
                                <Logo width={85} />
                            </p>
                        </Columns.Column>
                        <Columns.Column
                            size="three-fifths"
                            className="has-text-left"
                        >
                            <h1 className="title is-1 has-text-white">
                                Grand Theft Bootleg
                            </h1>
                            <p className="subtitle is-5 has-text-white" >
                                Music and its hidden sides submerged.<br />
                                What if we emerge them? 💿
                            </p>
                        </Columns.Column>
                    </Columns>
                </Section>
                <Section className={classNames(styles.search, "has-background-greyblue")} >
                    <form
                        onSubmit={ev => {
                            ev.preventDefault()
                            router.push({
                                pathname: '/bootleg/search',
                                query: {
                                    string: searchText
                                }
                            })
                        }}
                    >
                        <div className={classNames(styles.field, "field has-addons")}>
                            <div className="control is-expanded">
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    defaultValue={searchText || ''}
                                    className={classNames(styles.input, "input is-pink")}
                                    onChange={ev => setSearchText(ev.target.value)}
                                    minLength={3}
                                    required
                                    aria-label="What are you looking for?"
                                />
                            </div>
                            <div className="control">
                                <Button
                                    type="submit"
                                    iconLeft={faSearch}
                                    aria-label="search"
                                />
                            </div>
                        </div>
                    </form>
                </Section>
                <Section>
                    <Container>
                        <h2 className="title is-3 is-title-underline">
                            Most popular Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            {bootlegsPopularProps?.map((bootleg, i) => (
                                <Columns.Column
                                    size="one-fifth"
                                    key={`popular-${i}`}
                                >
                                    <BootlegCard
                                        bootleg={bootleg}
                                    />
                                </Columns.Column>
                            ))}
                        </Columns>
                        <p
                            className="has-text-right"
                        >
                            <Link
                                href={{
                                    pathname: '/bootleg/search',
                                    query: {
                                        orderBy: ESort.CLICKED_DESC
                                    }
                                }}
                            >
                                <a>
                                    See more &gt;
                                </a>
                            </Link>
                        </p>
                    </Container>
                    <br />
                </Section>

                <Section className="is-relative">
                    <div className={styles.skewed} />
                    <br />
                    <Container>
                        <h2 className="title is-3 has-text-white is-title-underline">
                            How Grand Theft Bootleg works?
                        </h2>
                        <p className="is-size-5 has-text-white">
                            Participate in music history!
                        </p>
                        <br />
                        <br />
                        <Columns
                            className="is-8 is-variable"
                        >
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade left>
                                    <div>
                                        <p
                                            className="has-text-white has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faHandshake}
                                            />
                                        </p>
                                        <h3 className="title is-5 has-text-white has-text-centered">
                                            Have a <b>bootleg</b>?
                                        </h3>
                                        <p className="subtitle is-6 has-text-white has-text-centered">
                                            Let's share them with the community!
                                        </p>
                                        <Button
                                            label="Share"
                                            href="/bootleg/new/edit"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade bottom>
                                    <div>
                                        <p
                                            className="has-text-white has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faSearch}
                                            />
                                        </p>
                                        <h3 className="title is-5 has-text-white has-text-centered">
                                            Want to <b>listen</b> to something?
                                        </h3>
                                        <p className="subtitle is-6 has-text-white has-text-centered">
                                            Search, find and listen!
                                        </p>
                                        <Button
                                            label="Search"
                                            href="/bootleg/search"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade right>
                                    <div>
                                        <p
                                            className="has-text-white has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faQuestion}
                                            />
                                        </p>
                                        <h3 className="title is-5 has-text-white has-text-centered">
                                            A <b>question</b>?
                                        </h3>
                                        <p className="subtitle is-6 has-text-white has-text-centered">
                                            You can message us directly!
                                        </p>
                                        <Button
                                            label="Contact us"
                                            href="/general-conditions"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
                <Section>
                    <br />
                    <Container>
                        <h2 className="title is-3 is-title-underline">
                            Newly added Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            {bootlegsNewProps?.map((bootleg, i) => (
                                <Columns.Column
                                    size="one-fifth"
                                    key={`new-${i}`}
                                >
                                    <BootlegCard
                                        bootleg={bootleg}
                                    />
                                </Columns.Column>
                            ))}
                        </Columns>
                        <p
                            className="has-text-right"
                        >
                            <Link
                                href={{
                                    pathname: '/bootleg/search',
                                    query: {
                                        orderBy: ESort.DATE_CREATION_DESC
                                    }
                                }}
                            >
                                <a>
                                    See more &gt;
                                </a>
                            </Link>
                        </p>
                    </Container>
                    <br />
                </Section>
                <Section className="is-relative">
                    <div className={styles.skewed} />
                    <br />
                    <Container>
                        <h2 className="title is-3 has-text-white is-title-underline">
                            Join the community
                        </h2>
                        <Columns className="is-vcentered">
                            <Columns.Column size="two-thirds">
                                <p className="is-size-5 has-text-white">
                                    You too, join the community and share your passion for your favorite bands. Help us bring out the bootlegs lost in the depths of the abyss! 🌊
                                </p>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                <Fade right>
                                    <Button
                                        label="Register"
                                        href="/user/register"
                                        iconRight={faUserCheck}
                                        styles={{ button: 'is-fullwidth' }}
                                        aria-label="register"
                                    />
                                </Fade>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
                <Section>
                    <br />
                    <Container>
                        <h2 className="title is-3 is-title-underline">
                            Top random Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            {bootlegsRandomProps?.map((bootleg, i) => (
                                <Columns.Column
                                    size="one-fifth"
                                    key={`random-${i}`}
                                >
                                    <BootlegCard
                                        bootleg={bootleg}
                                    />
                                </Columns.Column>
                            ))}
                        </Columns>
                        <p
                            className="has-text-right"
                        >
                            <Link
                                href={{
                                    pathname: '/bootleg/search',
                                    query: {
                                        isRandom: 1
                                    }
                                }}
                            >
                                <a>
                                    See more &gt;
                                </a>
                            </Link>
                        </p>
                    </Container>
                    <br />
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
        try {
            const bootlegHandler = new BootlegHandler({ req })
            const [[bootlegsPopular], [bootlegsNew], [bootlegsRandom]] = await Promise.all([
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.CLICKED_DESC
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    isRandom: 1
                }).fetch()
            ])

            return {
                props: {
                    bootlegsPopularProps: bootlegsPopular.map(x => x.toJson()),
                    bootlegsNewProps: bootlegsNew.map(x => x.toJson()),
                    bootlegsRandomProps: bootlegsRandom.map(x => x.toJson())
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
                    console.error(error)
                    return {
                        props: {
                            bootlegsPopular: [],
                            bootlegsNew: [],
                            bootlegsRandom: []
                        }
                    }
            }
        }
    }
)

export default connect((state) => state)(Index)