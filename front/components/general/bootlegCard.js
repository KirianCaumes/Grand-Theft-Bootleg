import React from 'react'
// @ts-ignore
import { Card, Heading } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/components/general/bootlegcard.module.scss"
import classNames from 'classnames'
import Link from 'next/link'
import Bootleg from 'request/objects/bootleg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEye } from '@fortawesome/free-regular-svg-icons'
import { ESearch } from "types/searchFilters/search"
import getConfig from 'next/config'
import Image from 'next/image'

/**
 * BootlegCard
 * @param {object} props 
 * @param {Bootleg} props.bootleg
 */
export default function BootlegCard({ bootleg }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <article className={classNames(styles.bootlegcard, "card")}>
            <div className="card-image">
                <Link
                    href={`/bootleg/${encodeURIComponent(bootleg.title)}-${encodeURIComponent(bootleg._id)}`}
                >
                    <a>
                        <figure className="image">
                            <Image
                                src={bootleg.picture ? `${publicRuntimeConfig.backUrl}/images/${bootleg.picture}` : '/logo.png'}
                                alt={bootleg.title ?? "bootleg"}
                                layout="fill"
                                title={bootleg.title}
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
                                <a
                                    title={bootleg.title}
                                >
                                    {bootleg.title}
                                </a>
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
                                        href={`/bootleg/search?string=${encodeURIComponent(band?.toLowerCase())}&searchBy=${ESearch.BAND}`}
                                    >
                                        <a
                                            title={band}
                                        >
                                            {band}
                                        </a>
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
