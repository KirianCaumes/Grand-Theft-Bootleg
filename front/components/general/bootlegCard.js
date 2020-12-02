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
    /** @type {string} Time posted ago */
    const timeAgo = useMemo(
        () => {
            if (!bootleg.createdOn)
                return ''

            const msPerMinute = 60 * 1000
            const msPerHour = msPerMinute * 60
            const msPerDay = msPerHour * 24
            const msPerMonth = msPerDay * 30
            const msPerYear = msPerDay * 365

            const elapsed = new Date().getTime() - new Date(bootleg.createdOn)?.getTime()

            if (elapsed < msPerMinute) {
                const res = Math.round(elapsed / 1000)
                return `${res} second${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerHour) {
                const res = Math.round(elapsed / msPerMinute)
                return `${res} minute${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerDay) {
                const res = Math.round(elapsed / msPerHour)
                return `${res} hour${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerMonth) {
                const res = Math.round(elapsed / msPerDay)
                return `${res} day${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerYear) {
                const res = Math.round(elapsed / msPerMonth)
                return `${res} month${res > 1 ? 's' : ''} ago`
            } else {
                const res = Math.round(elapsed / msPerYear)
                return `${res} year${res > 1 ? 's' : ''} ago`
            }
        },
        [bootleg]
    )

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
                                    target.src = "logo.png"
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
                                <FontAwesomeIcon icon={faClock} /> {timeAgo}
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
