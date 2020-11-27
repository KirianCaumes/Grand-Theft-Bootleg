import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake, faQuestion, faSearch, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import BootlegCard from "components/bootlegCard"
import { Logo } from "components/svg/icon"
import { useRouter } from 'next/router'
import { Bootleg } from 'request/objects/bootleg'
import Link from "next/link"
import config from 'react-reveal/globals'
import Fade from 'react-reveal/Fade'
import { ESort } from "static/searchFilters/sort"

config({ ssrFadeout: true })

/**
 * @typedef {object} IndexProps
 * @property {string} test Test
 * @property {Bootleg[]} bootlegsPopular Bootlegs from API
 * @property {Bootleg[]} bootlesgNew Bootlegs from API
 * @property {Bootleg[]} bootlegsRandom Bootlegs from API
 */

/**
 * Index page
 * @param {GlobalProps & IndexProps} props 
 */
function Index({ bootlegsPopular, bootlesgNew, bootlegsRandom, test = "qsdqsd", ...props }) {
    const router = useRouter()

    /** @type {[string, function(string):any]} Search text */
    const [searchText, setSearchText] = React.useState(null)

    return (
        <>
            <Head>
                <title>Home - {props.appname}</title>
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
                                pathname: '/search',
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
                                />
                            </div>
                            <div className="control">
                                <button
                                    className="button is-pink"
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
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
                            {bootlegsPopular?.map((bootleg, i) => (
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
                                href="/search?orderBy=CLICKED_DESC"
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
                                        <Link href="/">
                                            <a
                                                className="button is-pink is-outlined is-fullwidth"
                                            >
                                                Share
                                            </a>
                                        </Link>
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
                                        <Link href="/">
                                            <a
                                                className="button is-pink is-outlined is-fullwidth"
                                            >
                                                Search
                                            </a>
                                        </Link>
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
                                        <Link href="/">
                                            <a
                                                className="button is-pink is-outlined is-fullwidth"
                                            >
                                                Contact us
                                            </a>
                                        </Link>
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
                            {bootlesgNew?.map((bootleg, i) => (
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
                                href="/search?orderBy=DATE_CREATION_DESC"
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
                                    <Link
                                        href="/register"
                                    >
                                        <a className="button is-pink is-fullwidth">
                                            Register&nbsp;<FontAwesomeIcon icon={faUserCheck} />
                                        </a>
                                    </Link>
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
                            Top random Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            {bootlegsRandom?.map((bootleg, i) => (
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
                                href="/search?isRandom=1"
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


Index.getInitialProps = async (ctx) => {
    try {
        const bootlegManager = new BootlegManager()
        const [bootlegsPopular, bootlesgNew, bootlegsRandom] = await Promise.all([
            bootlegManager.getAll({
                limit: 5,
                orderBy: ESort.CLICKED_DESC
            }),
            bootlegManager.getAll({
                limit: 5,
                orderBy: ESort.DATE_CREATION_DESC
            }),
            bootlegManager.getAll({
                limit: 5,
                isRandom: 1
            })
        ])
        return { bootlegsPopular, bootlesgNew, bootlegsRandom }
    } catch (error) {
        console.log(error)
        return { bootlegsPopular: [], bootlesgNew: [], bootlegsRandom: [] }
    }
}

export default Index