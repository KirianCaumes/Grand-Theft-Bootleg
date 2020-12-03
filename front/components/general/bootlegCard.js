import React, { useCallback, useMemo } from 'react'
// @ts-ignore
import { Card, Heading } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/components/bootlegcard.module.scss"
import classNames from 'classnames'
import Link from 'next/link'
import { Bootleg } from 'request/objects/bootleg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEye } from '@fortawesome/free-regular-svg-icons'

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
                        <figure className="image">
                            <img //TODO remplace later with IMAGE component from Next
                                src={bootleg.picture}
                                alt={bootleg.title ?? "bootleg"}
                                onError={ev => {
                                    const target = /** @type {HTMLImageElement} */(ev.target)
                                    target.src = "/logo.png"
                                }}
                            />
                        </figure>
                    </a>
                </Link>
                <div className={styles.date}>
                    <time
                        dateTime={new Date(bootleg.date)?.toISOString().slice(0, 10)}
                    >
                        <Link
                            href={`/bootleg/search?year=${encodeURIComponent(new Date(bootleg.date)?.getFullYear())}`}
                        >
                            {new Date(bootleg.date)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' })}
                        </Link>
                    </time>
                </div>
            </div>
            <Card.Content>
                <div className="media">
                    <div className={classNames(styles.mediacontent, "media-content")}>
                        <Heading
                            renderAs="h3"
                            size={5}
                            className="is-capitalize"
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
                            className="is-capitalize"
                        >
                            {bootleg.bands?.map((band, i) => (
                                <React.Fragment key={i}>
                                    <Link
                                        href={`/bootleg/search?band=${encodeURIComponent(band)}`}
                                    >
                                        {band}
                                    </Link>
                                    {i < bootleg.bands.length - 1 && ', '}
                                </React.Fragment>
                            ))}
                        </Heading>
                        <p className="flex-row flex-space-between">
                            <span className="flex-one">
                                <FontAwesomeIcon icon={faClock} /> {bootleg.timeAgo}
                            </span>
                            <span className="flex-one has-text-right">
                                <FontAwesomeIcon icon={faEye} /> {bootleg.clickedCount} times
                            </span>
                        </p>
                    </div>
                </div>
            </Card.Content>
        </article>
    )
}
