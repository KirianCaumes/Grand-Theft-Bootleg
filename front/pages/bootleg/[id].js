import React, { useCallback, useMemo } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/id.module.scss"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { Bootleg } from 'request/objects/bootleg'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faMapMarker, faHeadphonesAlt } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarLight } from '@fortawesome/free-regular-svg-icons'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
import getConfig from 'next/config'
import { wrapper } from "redux/store"
import { AnyAction, Store } from 'redux'
import { MainState } from "redux/slices/main"

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootleg Bootleg
 */

/**
 * Bootleg page
 * @param {BootlegProps & ManagersProps} props 
 */
function BootlegDetail({ bootleg, bootlegManager, ...props }) {
    const { publicRuntimeConfig } = getConfig()

    /** Score */
    const score = useCallback(
        /**
         * Get score
         * @param {number} value score
         */
        (value = 0) => <>
            {new Array(value)
                .fill({})
                .map((x, i) =>
                    <FontAwesomeIcon className="has-text-pink" icon={faStar} key={i} />
                )
            }
            {new Array(5 - value)
                .fill({})
                .map((x, i) =>
                    <FontAwesomeIcon className="has-text-pink" icon={faStarLight} key={i} />
                )
            }
        </>,
        [bootleg]
    )

    /** Set list */
    const setlist = useMemo(
        () => <>
            <h2 className="title is-4 is-title-underline">Setlist</h2>
            <ul className="block-list is-small has-radius is-greyblue is-highlighted ">
                {bootleg.songs?.map((song, i) => (
                    <li
                        key={i}
                        className="is-capitalize"
                    >
                        <strong>{i + 1} - </strong>
                        <Link
                            href={`/bootleg/search?song=${encodeURIComponent(song?.toLocaleLowerCase())}`}
                        >
                            <a>
                                {song}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </>,
        [bootleg]
    )

    /** Hostname */
    const hostname = useCallback(
        /**
         * Get hostname
         * @param {string} url Url
         */
        (url) => {
            try {
                const host = (new URL(url))?.hostname?.split('.')
                return host?.length > 2 ? host?.[1] : host?.[0]
            } catch {
                return null
            }
        },
        [bootleg]
    )

    return (
        <>
            <Head>
                <title>{bootleg.title} - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles.id}>
                <Section>
                    <Container>
                        <Columns className="is-variable is-8">
                            <Columns.Column className="is-two-thirds-desktop">
                                <Columns className="is-variable is-3">
                                    <Columns.Column size="one-third">
                                        <figure className="image">
                                            <img //TODO remplace later with IMAGE component from Next
                                                src={bootleg.picture}
                                                alt={bootleg.title ?? "bootleg"}
                                                onError={ev => {
                                                    const target = /** @type {HTMLImageElement} */(ev.target)
                                                    target.src = "logo.png"
                                                }}
                                            />
                                        </figure>
                                    </Columns.Column>
                                    <Columns.Column size="two-thirds">
                                        <h1
                                            className="title is-3 is-title-underline is-capitalize"
                                            title={bootleg.title}
                                        >
                                            {bootleg.title}
                                        </h1>
                                        <p>
                                            {bootleg.description}
                                        </p>
                                    </Columns.Column>
                                </Columns>
                                <div className="is-hidden-mobile">
                                    {setlist}
                                </div>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                <h2 className="title is-4 is-title-underline">
                                    Details&nbsp;
                                    <span className="tag is-greyblue is-v-bottom"><FontAwesomeIcon icon={faMapMarker} />&nbsp;&nbsp;{bootleg.stateName}</span>
                                </h2>
                                <p className="is-capitalize">
                                    <strong>Date:</strong>
                                    <Link
                                        href={`/bootleg/search?year=${encodeURIComponent(new Date(bootleg.date)?.getFullYear())}`}
                                    >
                                        <a>
                                            {new Date(bootleg.date)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' })}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>{bootleg.bands?.length > 1 ? 'Bands' : 'Band'}:</strong>
                                    {bootleg.bands?.map((band, i) => (
                                        <React.Fragment key={i}>
                                            <Link
                                                href={`/bootleg/search?band=${encodeURIComponent(band?.toLowerCase())}`}
                                            >
                                                {band}
                                            </Link>
                                            {i < bootleg.bands?.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <p className="is-capitalize">
                                    <strong>{bootleg.countries?.length > 1 ? 'Countries' : 'Country'}:</strong>
                                    {bootleg.countries?.map((country, i) => (
                                        <React.Fragment key={i}>
                                            <Link
                                                href={`/search?country=${encodeURIComponent(country)}`}
                                            >
                                                {country}
                                            </Link>
                                            {i < bootleg.countries?.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <p className="is-capitalize">
                                    <strong>{bootleg.cities?.length > 1 ? 'Cities' : 'City'}:</strong>
                                    {bootleg.cities?.map((city, i) => (
                                        <React.Fragment key={i}>
                                            <Link
                                                href={`/bootleg/search?city=${encodeURIComponent(city?.toLowerCase())}`}
                                            >
                                                {city}
                                            </Link>
                                            {i < bootleg.countries?.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                </p>

                                <br />
                                <br />
                                <h2 className="title is-4 is-title-underline">
                                    {bootleg.isAudioOnly ? 'Listen' : 'Watch'}
                                </h2>
                                <div className="field is-grouped">
                                    {bootleg.links?.map((link, i) =>
                                        <p className="control" key={i}>
                                            <a
                                                className="button is-pink"
                                                href={link}
                                                target="_blank"
                                                onClick={async () => {
                                                    try {
                                                        await bootlegManager.click(bootleg._id)
                                                    } catch (error) {
                                                        console.error(error?.message)
                                                    }
                                                }}
                                            >
                                                <span className="icon">
                                                    <FontAwesomeIcon icon={faHeadphonesAlt} />
                                                </span>
                                                <span className="is-capitalize">{hostname(link) ?? `Link N°${i + 1}`}</span>
                                            </a>
                                        </p>
                                    )}
                                </div>

                                <br />
                                <br />
                                <h2 className="title is-4 is-title-underline">
                                    Informations
                                </h2>

                                <p className="is-capitalize">
                                    <strong>Audio only:</strong>
                                    <Link
                                        href={`/bootleg/search?isAudioOnly=${encodeURIComponent(bootleg.isAudioOnly ? 1 : 0)}`}
                                    >
                                        <a>
                                            {bootleg.isAudioOnly ? 'Yes' : 'No'}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>Complete show:</strong>
                                    <Link
                                        href={`/bootleg/search?isCompleteShow=${encodeURIComponent(bootleg.isCompleteShow ? 1 : 0)}`}
                                    >
                                        <a>
                                            {bootleg.isCompleteShow ? 'Yes' : 'No'}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>Pro record:</strong>
                                    <Link
                                        href={`/bootleg/search?isProRecord=${encodeURIComponent(bootleg.isProRecord ? 1 : 0)}`}
                                    >
                                        <a>
                                            {bootleg.isProRecord ? 'Yes' : 'No'}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>Sound quality:</strong>
                                    {score(bootleg.soundQuality)}
                                </p>

                                <p className="is-capitalize">
                                    <strong>Video quality:</strong>
                                    {bootleg.isAudioOnly ? <i>N/A</i> : score(bootleg.videoQuality)}
                                </p>

                                <br />
                                <br />

                                <h2 className="title is-4 is-title-underline">
                                    Creator
                                </h2>
                                <p className="is-capitalize">
                                    <strong>Submited by:</strong>
                                    <Link
                                        href={`/bootleg/search?authorId=${encodeURIComponent(bootleg.createdById)}`}
                                    >
                                        <a>
                                            {bootleg.createdBy?.username ?? <i>Deleted user</i>}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>Submited on:</strong>
                                    <Link
                                        href={`/bootleg/search?year=${encodeURIComponent(new Date(bootleg.createdOn)?.getFullYear())}`}
                                    >
                                        <a>
                                            {new Date(bootleg.createdOn)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' })}
                                        </a>
                                    </Link>
                                </p>

                                <p className="is-capitalize">
                                    <strong>Time listened:</strong>
                                    {bootleg.clickedCount}
                                </p>

                                <div className="is-hidden-tablet">
                                    <br />
                                    <br />
                                    {setlist}
                                </div>

                                <br />
                                <a
                                    onClick={() => {

                                    }}
                                >
                                    Report
                                </a>
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
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; }, AnyAction>;}} ctx
     */
    async ({ query, req }) => {
        try {
            const bootlegManager = new BootlegManager({ req })
            const id = /** @type {string} */ (query.id)
            const bootleg = await bootlegManager.getById(id.substring(id?.lastIndexOf("-") + 1))

            return { props: { bootleg: JSON.parse(JSON.stringify(bootleg)) } }
        } catch (error) {
            console.log(error)
            return { notFound: true }
            // return { props: { bootleg: {} } }
        }
    }
)

export default withManagers(BootlegDetail)