import React from 'react'
// @ts-ignore
import { Card, Heading } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/components/bootlegcard.module.scss"
import classNames from 'classnames'
import Link from 'next/link'
import { Bootleg } from 'request/objects/bootleg'

/**
 * BootlegCard
 * @param {object} props 
 * @param {Bootleg} props.bootleg
 */
export default function BootlegCard({ bootleg }) {
    return (
        <article className={classNames(styles.bootlegcard, "card")}>
            <div className="card-image">
                <Link
                    href={`/bootleg/${encodeURIComponent(bootleg.title)}-${encodeURIComponent(bootleg._id)}`}
                >
                    <a>
                        <figure className={classNames(styles.figure, "image")}>
                            <img className={styles.image} src={bootleg.picture} alt={bootleg.title ?? "bootleg"} />
                        </figure>
                    </a>
                </Link>
            </div>
            <Card.Content>
                <div className="media">
                    <div className={classNames(styles.mediacontent, "media-content")}>
                        <Heading
                            renderAs="h3"
                            size={5}
                            className={styles.title}
                        >
                            <Link
                                href={`/bootleg/${encodeURIComponent(bootleg.title)}-${encodeURIComponent(bootleg._id)}`}
                            >
                                {bootleg.title}
                            </Link>
                        </Heading>
                        <Heading
                            renderAs="h4"
                            subtitle
                            size={6}
                            className={styles.subtitle}
                        >
                            {bootleg.bands?.map((band, i) => (
                                <React.Fragment key={i}>
                                    <Link
                                        href={`/search?band=${encodeURIComponent(band)}`}
                                    >
                                        {band}
                                    </Link>
                                    {i < bootleg.bands.length - 1 && ', '}
                                </React.Fragment>
                            ))}
                        </Heading>
                        <Heading
                            className={styles.time}
                            renderAs="p"
                            subtitle
                            size={6}
                        >
                            <time
                                dateTime={new Date(bootleg.date)?.toISOString().slice(0, 10)}
                                className={styles.subtitle}
                            >
                                <Link
                                    href={`/search?year=${encodeURIComponent(new Date(bootleg.date)?.toISOString()?.slice(0, 10))}`}
                                >
                                    {new Date(bootleg.date)?.toLocaleDateString('en-EN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </Link>
                            </time>
                        </Heading>
                    </div>
                </div>
            </Card.Content>
        </article>
    )
}
