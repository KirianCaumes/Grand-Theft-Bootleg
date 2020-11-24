import React from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { Bootleg } from 'request/objects/bootleg'
import Link from "next/link"

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootleg Bootleg
 */

/**
 * Bootleg page
 * @param {GlobalProps & BootlegProps} props 
 */
function BootlegDetail({ bootleg, ...props }) {
    console.log(bootleg)

    return (
        <>
            <Head>
                <title>{bootleg.title} - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                <Section>
                    <Container>
                        <Columns>
                            <Columns.Column size="two-thirds">
                                <Columns>
                                    <Columns.Column size="one-third">
                                        <img
                                            src={bootleg.picture}
                                            alt={bootleg.title ?? "bootleg"}
                                            onError={ev => {
                                                const target = /** @type {HTMLImageElement} */(ev.target)
                                                target.src = "logo.png"
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column size="two-thirds">
                                        <h1 className="title is-3">
                                            {bootleg.title}
                                        </h1>
                                        <p className="is-size-5">
                                            {bootleg.description}
                                        </p>
                                    </Columns.Column>
                                </Columns>
                                <h2 className="title is-4">Details</h2>
                                <p>{bootleg.bands.length > 1 ? 'Bands' : 'Band'}:&nbsp;
                                {bootleg.bands?.map((band, i) => (
                                    <React.Fragment key={i}>
                                        <Link
                                            href={`/search?band=${encodeURIComponent(band)}`}
                                        >
                                            {band}
                                        </Link>
                                        {i < bootleg.bands.length - 1 && ', '}
                                    </React.Fragment>
                                ))}</p>
                                <p>{bootleg.countries.length > 1 ? 'Countries' : 'Country'}:&nbsp;
                                {bootleg.countries?.map((country, i) => (
                                    <React.Fragment key={i}>
                                        <Link
                                            href={`/search?country=${encodeURIComponent(country)}`}
                                        >
                                            {country}
                                        </Link>
                                        {i < bootleg.countries.length - 1 && ', '}
                                    </React.Fragment>
                                ))}</p>
                                <p>{bootleg.cities.length > 1 ? 'Cities' : 'City'}:&nbsp;
                                {bootleg.cities?.map((city, i) => (
                                    <React.Fragment key={i}>
                                        <Link
                                            href={`/search?city=${encodeURIComponent(city)}`}
                                        >
                                            {city}
                                        </Link>
                                        {i < bootleg.countries.length - 1 && ', '}
                                    </React.Fragment>
                                ))}</p>

                                <br />
                                <br />
                                <h2 className="title is-4">Setlist</h2>
                                <ul>
                                    {bootleg.songs?.map((song, i) => (
                                        <li key={i}>{song}</li>
                                    ))}
                                </ul>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                <h2 className="title is-4">Informations</h2>
                                <p>Submited by: {bootleg.createdBy.username}</p>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}

/**
 *
 * @param {GetServerSidePropsContext} ctx
 */
export async function getServerSideProps(ctx) {
    try {
        const bootlegManager = new BootlegManager()
        const id = /** @type {string} */ (ctx.query.id)
        const bootleg = await bootlegManager.getById(id.substring(id?.lastIndexOf("-") + 1))

        return { props: { bootleg: JSON.parse(JSON.stringify(bootleg)) } }
    } catch (error) {
        console.log(error)
        // return {notFound: true }
        return { props: { bootleg: {} } }
    }
}


export default BootlegDetail